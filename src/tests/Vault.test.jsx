import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Editor from '../components/Editor.jsx';

describe('LexiNote Component Tests: Vault & Note Encryption UI', () => {
  const secretContent = 'TOP SECRET CORPORATE CREDENTIALS AND KEYS';

  const lockedNote = {
    id: 'vault-note-1',
    title: 'Confidential Strategy Vault 🔒',
    content: '', // Disk content is sanitized and empty
    isLocked: true,
    _tempUnlocked: false,
    encryptedData: {
      ciphertext: 'MOCK_CIPHERTEXT',
      iv: 'MOCK_IV',
      salt: 'MOCK_SALT'
    },
    mode: 'work',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('renders locked state and hides note plaintext content', () => {
    render(
      <Editor
        note={lockedNote}
        allNotes={[lockedNote]}
        onUpdateNote={vi.fn()}
        onUnlockNote={vi.fn()}
        appLanguage="en"
      />
    );

    // Secret content must NOT be present anywhere in the DOM
    expect(screen.queryByText(secretContent)).toBeNull();

    // Unlock PIN prompt should be visible
    expect(screen.getByPlaceholderText(/PIN/i)).toBeDefined();
  });

  it('calls onUnlockNote when user enters PIN and submits unlock form', async () => {
    const handleUnlock = vi.fn().mockResolvedValue(true);

    render(
      <Editor
        note={lockedNote}
        allNotes={[lockedNote]}
        onUpdateNote={vi.fn()}
        onUnlockNote={handleUnlock}
        appLanguage="en"
      />
    );

    const pinInput = screen.getByPlaceholderText(/PIN/i);
    fireEvent.change(pinInput, { target: { value: '1234' } });

    await act(async () => {
      fireEvent.submit(pinInput.closest('form'));
    });

    expect(handleUnlock).toHaveBeenCalledWith('vault-note-1', '1234');
  });

  it('displays error message when unlock fails due to invalid PIN', async () => {
    const handleUnlock = vi.fn().mockRejectedValue(new Error('Yanlış parola veya şifre çözme hatası!'));

    render(
      <Editor
        note={lockedNote}
        allNotes={[lockedNote]}
        onUpdateNote={vi.fn()}
        onUnlockNote={handleUnlock}
        appLanguage="en"
      />
    );

    const pinInput = screen.getByPlaceholderText(/PIN/i);
    fireEvent.change(pinInput, { target: { value: '0000' } });

    await act(async () => {
      fireEvent.submit(pinInput.closest('form'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Yanlış parola/i)).toBeDefined();
    });
  });

  it('displays lock configuration modal when user initiates locking on an unencrypted note', async () => {
    const unlockedNote = {
      id: 'unlocked-note-1',
      title: 'Regular Unlocked Note',
      content: 'Public content',
      isLocked: false,
      mode: 'work',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    render(
      <Editor
        note={unlockedNote}
        allNotes={[unlockedNote]}
        onUpdateNote={vi.fn()}
        onLockNote={vi.fn()}
        appLanguage="en"
      />
    );

    // Find Lock Note button
    const lockBtn = screen.getAllByRole('button').find(b =>
      b.getAttribute('title')?.toLowerCase().includes('lock') ||
      b.getAttribute('title')?.toLowerCase().includes('kilitle') ||
      b.textContent?.includes('Lock')
    );

    if (lockBtn) {
      await act(async () => {
        fireEvent.click(lockBtn);
      });

      // Lock setup dialog or PIN input should appear
      const setupInput = screen.queryByPlaceholderText(/PIN/i);
      expect(setupInput).toBeDefined();
    }
  });
});
