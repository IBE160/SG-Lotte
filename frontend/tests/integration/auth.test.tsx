import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardPage from '@/app/dashboard/page';
import { createSupabaseBrowserClient } from '@/lib/supabase';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  createSupabaseBrowserClient: jest.fn(),
}));

describe('Protected Route', () => {
  it('redirects to /login if user is not authenticated', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (createSupabaseBrowserClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });
  });

  it('renders the dashboard if user is authenticated', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (createSupabaseBrowserClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              user: { email: 'test@example.com' },
            },
          },
        }),
      },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to your Dashboard')).toBeInTheDocument();
      expect(screen.getByText('You are logged in as: test@example.com')).toBeInTheDocument();
    });
  });
});
