import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import ChangeUserAvatar from './ChangeUserAvatar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

vi.mock('@/services/avatar')
vi.mock('@/contexts/AuthContext')

describe('ChangeUserAvatar', async () => {
  const { useAuth }: { useAuth: any } = await import('@/contexts/AuthContext')
  const { uploadUserAvatar }: { uploadUserAvatar: any } = await import(
    '@/services/avatar'
  )

  useAuth.mockReturnValue({
    currentUser: {
      id: '1'
    }
  })

  vi.setSystemTime(123)

  test('Shows profile img with date', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ChangeUserAvatar
          profile={{
            id: '1',
            email: 'mail@test.com',
            avatar_url: 'https://test.com',
            full_name: 'Test User'
          }}
        />
      </QueryClientProvider>
    )

    const avatar = await screen.findByAltText<HTMLImageElement>(
      'Test User avatar'
    )
    expect(avatar).toBeTruthy()
    expect(avatar.src).toBe('https://test.com?123')
  })

  test('does not change avatar if there is no file', async () => {
    const input = await screen.findByLabelText('Upload avatar')

    fireEvent.change(input, {
      target: {
        files: null
      }
    })

    await waitFor(() => expect(uploadUserAvatar).not.toHaveBeenCalled())
  })

  test('Changes avatar with current user id and input file', async () => {
    const input = await screen.findByLabelText('Upload avatar')

    fireEvent.change(input, {
      target: {
        files: ['Test Image']
      }
    })

    await waitFor(() =>
      expect(uploadUserAvatar).toHaveBeenCalledWith({
        id: '1',
        avatar: 'Test Image'
      })
    )
  })
})
