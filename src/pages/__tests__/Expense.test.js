import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';

// create mocks for api methods
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();

jest.mock('../../api/axiosConfig', () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
    put: (...args) => mockPut(...args),
    delete: (...args) => mockDelete(...args),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

import Expense from '../Expense';

describe('Expense page', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
    mockPut.mockReset();
    mockDelete.mockReset();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    localStorage.setItem('token', 'dummy');
    localStorage.setItem('name', 'tester');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  test('loads categories and expenses and renders them', async () => {
    // first get -> categories, second get -> expenses
    mockGet.mockResolvedValueOnce({ data: [{ categoryId: 1, categoryName: 'Food' }] });
    mockGet.mockResolvedValueOnce({ data: [{ expenseId: 10, description: 'Lunch', categoryName: 'Food', spendDate: '2025-12-01T00:00:00', amountSpent: 150, categoryId:1 }] });

    const { container } = render(<Expense />);

    // Wait for category option inside the select
    const select = container.querySelector('select');
    await waitFor(() => expect(select).not.toBeNull());
    await waitFor(() => expect(within(select).getByRole('option', { name: 'Food' })).toBeInTheDocument());

    // Expense row should render; assert amount within that row to avoid matching the Total
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    const row = screen.getByText('Lunch').closest('tr');
    expect(within(row).getByText(/₹\s*150/)).toBeInTheDocument();
  });

  test('submits a new expense and clears the form', async () => {
    // initial calls: categories, expenses
    mockGet.mockResolvedValueOnce({ data: [{ categoryId: 1, categoryName: 'Food' }] });
    mockGet.mockResolvedValueOnce({ data: [] });

    // after adding expense, AddExpense post resolves, then fetchExpenses returns updated list
    mockPost.mockResolvedValueOnce({});
    mockGet.mockResolvedValueOnce({ data: [{ expenseId: 11, description: 'Dinner', categoryName: 'Food', spendDate: '2025-12-02T00:00:00', amountSpent: 200, categoryId:1 }] });

    const { container } = render(<Expense />);

    // wait for category to load
    await waitFor(() => expect(screen.getByText('Food')).toBeInTheDocument());

    // find inputs from the DOM
    const amountInput = container.querySelector('input[type="number"]');
    const categorySelect = container.querySelector('select');
    const dateInput = container.querySelector('input[type="date"]');
    const allInputs = container.querySelectorAll('input');
    const descInput = Array.from(allInputs).find((i) => i.type === 'text' || i.type === '') || allInputs[allInputs.length - 1];

    // fill form
    fireEvent.change(amountInput, { target: { value: '200' } });
    fireEvent.change(categorySelect, { target: { value: '1' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-02' } });
    if (descInput) fireEvent.change(descInput, { target: { value: 'Dinner' } });

    const submitBtn = screen.getByRole('button', { name: /Add\s*Expense/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/Expense/AddExpense', {
        amountSpent: 200,
        categoryId: 1,
        spendDate: '2025-12-02',
        description: 'Dinner',
      });
    });

    // After successful add the form should be cleared (amount input empty)
    await waitFor(() => expect(screen.getByRole('spinbutton').value).toBe(''));
  });

  test('deletes an expense when confirmed', async () => {
    mockGet.mockResolvedValueOnce({ data: [{ categoryId: 1, categoryName: 'Food' }] });
    mockGet.mockResolvedValueOnce({ data: [{ expenseId: 20, description: 'Snack', categoryName: 'Food', spendDate: '2025-12-03T00:00:00', amountSpent: 50, categoryId:1 }] });

    mockDelete.mockResolvedValueOnce({});

    render(<Expense />);

    await waitFor(() => expect(screen.getByText('Snack')).toBeInTheDocument());

    const row = screen.getByText('Snack').closest('tr');
    const buttons = within(row).getAllByRole('button');
    // second button in the actions is delete
    fireEvent.click(buttons[1]);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/Expense/DeleteExpense/20', { headers: { Authorization: `Bearer dummy` } });
    });
  });
});
