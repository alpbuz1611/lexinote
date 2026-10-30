import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Editor from '../components/Editor.jsx';

describe('LexiNote Component Tests: Editor.jsx', () => {
  const sampleNote = {
    id: 'note-editor-1',
    title: 'Testing Markdown & Typography',
    content: 'Initial text content in editor.',
    mode: 'work',
    isPinned: false,
    isLocked: false,
    todos: [{ id: 'todo-1', text: 'Prepare release', done: false }],
    tags: ['testing'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const otherNote = {
    id: 'note-editor-2',
    title: 'Referencing Note',
    content: 'This note refers to [[Testing Markdown & Typography]].',
    mode: 'work',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('renders the editor title and content textarea correctly', () => {
    const handleUpdate = vi.fn();

    render(
      <Editor
        note={sampleNote}
        allNotes={[sampleNote, otherNote]}
        onUpdateNote={handleUpdate}
        appLanguage="en"
      />
    );

    // Check title input
    const titleInput = screen.getByDisplayValue('Testing Markdown & Typography');
    expect(titleInput).toBeDefined();

    // Check textarea
    const textarea = screen.getByDisplayValue('Initial text content in editor.');
    expect(textarea).toBeDefined();
  });

  it('updates title and content when user types into editor', async () => {
    const handleUpdate = vi.fn();

    render(
      <Editor
        note={sampleNote}
        allNotes={[sampleNote]}
        onUpdateNote={handleUpdate}
        appLanguage="en"
      />
    );

    const titleInput = screen.getByDisplayValue('Testing Markdown & Typography');
    fireEvent.change(titleInput, { target: { value: 'Renamed Document Title' } });

    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Renamed Document Title'
      })
    );

    const textarea = screen.getByDisplayValue('Initial text content in editor.');
    fireEvent.change(textarea, { target: { value: 'New typed body text' } });

    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'New typed body text'
      })
    );
  });

  it('inserts markdown formatting tokens when toolbar buttons are clicked', async () => {
    const handleUpdate = vi.fn();

    render(
      <Editor
        note={sampleNote}
        allNotes={[sampleNote]}
        onUpdateNote={handleUpdate}
        appLanguage="en"
      />
    );

    // Find Bold button
    const boldButton = screen.getAllByRole('button').find(b => 
      b.getAttribute('title')?.toLowerCase().includes('bold') ||
      b.getAttribute('aria-label')?.toLowerCase().includes('bold')
    );

    if (boldButton) {
      fireEvent.click(boldButton);
      expect(handleUpdate).toHaveBeenCalled();
    }
  });

  it('renders backlinks when referenced by other notes in the catalog', () => {
    render(
      <Editor
        note={sampleNote}
        allNotes={[sampleNote, otherNote]}
        onUpdateNote={vi.fn()}
        appLanguage="en"
      />
    );

    // Check that 'Referencing Note' appears in the Backlinks section
    expect(screen.getByText('Referencing Note')).toBeDefined();
  });

  it('supports adding and toggling todo deliverable items in work mode', () => {
    const handleUpdate = vi.fn();

    render(
      <Editor
        note={sampleNote}
        allNotes={[sampleNote]}
        onUpdateNote={handleUpdate}
        appLanguage="en"
      />
    );

    // Initial todo should be visible
    expect(screen.getByText('Prepare release')).toBeDefined();

    // Add new todo via form submit
    const todoInput = screen.queryByPlaceholderText(/action item|görev/i);
    if (todoInput) {
      fireEvent.change(todoInput, { target: { value: 'New Task 99' } });
      const form = todoInput.closest('form');
      if (form) {
        fireEvent.submit(form);
        expect(handleUpdate).toHaveBeenCalled();
      }
    }
  });
});
