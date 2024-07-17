import { describe, test, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import ChatMessage from './ChatMessage'

vi.mock('@/contexts/AuthContext')

describe('ChatMessage', async () => {
  const { useAuth }: { useAuth: any } = await import('@/contexts/AuthContext')
  useAuth.mockReturnValue({ currentUser: { id: '1' } })

  test('Renders messages with different styles depending on sender', () => {
    render(
      <ChatMessage
        message={{
          id: '1',
          created_at: '123',
          text: 'Own message',
          channel_id: '1',
          sender_id: {
            id: '1',
            email: 'mail@test.com',
            avatar_url: '',
            full_name: ''
          },
          media_link: null,
          audio_link: null
        }}
      />
    )
    const ownMessage = screen.getByText('Own message')
    expect(ownMessage.parentElement?.parentElement?.className).toContain(
      'ml-auto'
    )

    render(
      <ChatMessage
        message={{
          id: '1',
          created_at: '123',
          text: 'Other user message',
          channel_id: '1',
          sender_id: {
            id: '2',
            email: 'mail@test.com',
            avatar_url: '',
            full_name: ''
          },
          media_link: null,
          audio_link: null
        }}
      />
    )
    const otherMessage = screen.getByText('Other user message')
    expect(otherMessage.parentElement?.parentElement?.className).toContain(
      'mr-auto'
    )
  })

  test('Renders media messages with different styles depending on sender', () => {
    render(
      <ChatMessage
        message={{
          id: '1',
          created_at: '123',
          text: 'Own media message',
          channel_id: '1',
          sender_id: {
            id: '1',
            email: 'mail@test.com',
            avatar_url: '',
            full_name: ''
          },
          media_link: 'https://example.com',
          audio_link: null
        }}
      />
    )

    const ownMediaMessage = screen.getByText('Own media message')
    expect(ownMediaMessage.parentElement?.className).toContain('ml-auto')

    render(
      <ChatMessage
        message={{
          id: '1',
          created_at: '123',
          text: 'Other media message',
          channel_id: '1',
          sender_id: {
            id: '2',
            email: 'mail@test.com',
            avatar_url: '',
            full_name: ''
          },
          media_link: 'https://example.com',
          audio_link: null
        }}
      />
    )

    const otherMediaMessage = screen.getByText('Other media message')
    expect(otherMediaMessage.parentElement?.className).toContain('mr-auto')

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(4)
  })

  test("Does not show media until it's loaded", () => {
    const image = screen.getAllByRole('img')[0]

    expect(
      image.parentElement?.parentElement?.classList.contains('hidden')
    ).toBeTruthy()

    fireEvent.load(image)

    expect(
      image.parentElement?.parentElement?.classList.contains('hidden')
    ).toBeFalsy()
  })

  test('Shows an error if media fails to load', () => {
    const image = screen.getAllByRole('img')[0]

    fireEvent.error(image)

    expect(screen.getByText('message.media-error')).toBeTruthy()
  })

  test('Renders audio messages with different styles depending on sender', () => {
    render(
      <ChatMessage
        message={{
          id: '1',
          created_at: '123',
          text: 'Own audio message',
          channel_id: '1',
          sender_id: {
            id: '1',
            email: 'mail@test.com',
            avatar_url: '',
            full_name: ''
          },
          media_link: null,
          audio_link: 'https://example.com'
        }}
      />
    )

    const ownAudioMessage = screen.getByText('Own audio message')
    expect(ownAudioMessage.parentElement?.className).toContain('ml-auto')

    render(
      <ChatMessage
        message={{
          id: '1',
          created_at: '123',
          text: 'Other audio message',
          channel_id: '1',
          sender_id: {
            id: '2',
            email: 'mail@test.com',
            avatar_url: '',
            full_name: ''
          },
          media_link: null,
          audio_link: 'https://example.com'
        }}
      />
    )

    const otherAudioMessage = screen.getByText('Other audio message')
    expect(otherAudioMessage.parentElement?.className).toContain('mr-auto')

    const audio = screen.getAllByTitle('Audio message')
    expect(audio).toHaveLength(2)
  })
})
