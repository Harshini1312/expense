import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the api module used by the component
const mockPost = jest.fn();
jest.mock('../../api/axiosConfig', () => ({
  __esModule: true,
  default: { post: (...args) => mockPost(...args) },
}));
import api from '../../api/axiosConfig';

// Mock react-router navigation with a minimal ESM-free shim
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({  
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

import Login from '../Login';

describe('Login page', () => {
  beforeEach(() => {
    mockPost.mockReset();
    mockNavigate.mockClear();
    localStorage.clear();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders name and password inputs and login button', () => {
    render(<Login />);

    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('successful login calls API, stores token and navigates', async () => {
    render(<Login />);

    const nameInput = screen.getByPlaceholderText(/Name/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /login/i });

    await userEvent.type(nameInput, 'alice');
    await userEvent.type(passwordInput, 'secret');

    // Mock successful response
    mockPost.mockResolvedValueOnce({ data: { name: 'alice', token: 'abc123' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/User/login', { name: 'alice', password: 'secret' });
    });

    // localStorage set
    expect(localStorage.getItem('name')).toBe('alice');
    expect(localStorage.getItem('token')).toBe('abc123');

    // navigate called
    expect(mockNavigate).toHaveBeenCalledWith('/Dashboard');
  });

  test('failed login shows alert', async () => {
    render(<Login />);

    const nameInput = screen.getByPlaceholderText(/Name/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /login/i });

    await userEvent.type(nameInput, 'bob');
    await userEvent.type(passwordInput, 'wrong');

    // Mock failed response
    mockPost.mockRejectedValueOnce(new Error('Unauthorized'));

    const alertSpy = jest.spyOn(window, 'alert');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
