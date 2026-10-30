import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from '../App.jsx';
import * as storageService from '../services/storageService.js';

describe('LexiNote Component Tests: App.jsx Lifecycle & Features', () => {
  beforeEach(async () => {
    localStorage.clear();
    await storageService.deleteDatabase();
    await storageService.initDB();
  });

  afterEach(async () => {
    await storageService.deleteDatabase();
  });

  it('renders initial application layout with Header and Sidebar', async () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    await act(async () => {
      render(<App />);
    });

    // Check application title or branding in Header
    expect(screen.getByText('LexiNote')).toBeDefined();

    // Check for "New Note" action button
    const newNoteButtons = screen.getAllByRole('button');
    expect(newNoteButtons.length).toBeGreaterThan(0);
  });

  it('loads notes from IndexedDB upon startup', async () => {
    const customNote = {
      id: 'custom-loaded-note-1',
      title: 'IndexedDB Startup Note',
      content: 'Loaded successfully from storage.',
      mode: 'work',
      isPinned: false,
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await storageService.saveNote(customNote);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('IndexedDB Startup Note')).toBeDefined();
    });
  });

  it('handles note creation and persists to storage', async () => {
    await act(async () => {
      render(<App />);
    });

    // Find and click new note trigger
    const newNoteBtn = screen.getAllByRole('button').find(b => 
      b.textContent?.includes('New Note') || b.textContent?.includes('Yeni Not')
    );
    expect(newNoteBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(newNoteBtn);
    });

    // Pick note type option from NewNoteModal
    const noteTypeOption = screen.getAllByRole('button').find(b =>
      b.textContent?.includes('Work') || b.textContent?.includes('İş') ||
      b.textContent?.includes('Plain') || b.textContent?.includes('Sade')
    );
    expect(noteTypeOption).toBeDefined();

    await act(async () => {
      fireEvent.click(noteTypeOption);
    });

    await waitFor(async () => {
      const noteCount = await storageService.countNotes();
      expect(noteCount).toBeGreaterThanOrEqual(1);
    });
  });

  it('handles note deletion cleanly with window.confirm', async () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    const initialNote = {
      id: 'delete-me-note',
      title: 'Note To Be Deleted',
      content: 'Will be removed.',
      mode: 'work',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await storageService.saveNote(initialNote);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Note To Be Deleted')).toBeDefined();
    });

    // Find delete button
    const deleteBtn = screen.getAllByRole('button').find(b => 
      b.getAttribute('title')?.includes('Delete') || b.getAttribute('title')?.includes('Sil')
    );

    if (deleteBtn) {
      await act(async () => {
        fireEvent.click(deleteBtn);
      });

      // Verify deletion from IndexedDB
      await waitFor(async () => {
        const check = await storageService.getNote('delete-me-note');
        expect(check).toBeNull();
      });
    }
  });

  it('switches application language dynamically', async () => {
    await act(async () => {
      render(<App />);
    });

    // Find language switcher button (e.g. TR or EN)
    const langBtn = screen.getAllByRole('button').find(b => 
      b.textContent?.includes('TR') || b.textContent?.includes('EN')
    );
    expect(langBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(langBtn);
    });

    // Language in localStorage updated
    expect(localStorage.getItem('lexinote_app_language')).toBeTruthy();
  });

  it('handles storage initialization error gracefully without crashing UI', async () => {
    vi.spyOn(storageService, 'initDB').mockRejectedValueOnce(new Error('Simulated IndexedDB failure'));

    await act(async () => {
      render(<App />);
    });

    // Application still renders without unhandled React crash
    expect(screen.getByText('LexiNote')).toBeDefined();
  });
});
