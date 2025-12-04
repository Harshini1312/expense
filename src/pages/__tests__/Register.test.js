import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// mock api
const mockPost = jest.fn();
jest.mock('../../api/axiosConfig', () => ({
  __esModule: true,
  default: { post: (...args) => mockPost(...args) },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

import Register from '../Register';

describe('Register page', () => {
  beforeEach(() => {
    mockPost.mockReset();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => jest.restoreAllMocks());

  test('renders inputs and register button', () => {
    render(<Register />);
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });

  test('enables button when password meets requirements and name present', async () => {
    render(<Register />);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const btn = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'alice' } });
    fireEvent.change(passwordInput, { target: { value: 'Abcdef1!' } });

    await waitFor(() => expect(btn).not.toBeDisabled());
  });

  test('successful register calls api and navigates', async () => {
    render(<Register />);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const btn = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'bob' } });
    fireEvent.change(passwordInput, { target: { value: 'Abcdef1!' } });

    mockPost.mockResolvedValueOnce({ data: { token: 'tok' } });

    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/User/Register', { name: 'bob', password: 'Abcdef1!' });
    });

    expect(localStorage.getItem('token')).toBe('tok');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('failed register shows alert', async () => {
    render(<Register />);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const btn = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'bob' } });
    fireEvent.change(passwordInput, { target: { value: 'Abcdef1!' } });

    mockPost.mockRejectedValueOnce({ response: { data: 'User exists' } });

    const alertSpy = jest.spyOn(window, 'alert');

    fireEvent.click(btn);

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('User exists'));
  });
});
