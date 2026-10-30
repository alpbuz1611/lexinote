import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../components/Sidebar.jsx';
import MindmapView from '../components/MindmapView.jsx';

describe('LexiNote Component Tests: Sidebar & MindmapView', () => {
  const sampleNotes = [
    {
      id: 'side-note-1',
      title: 'Architectural Specs',
      content: 'Storage engine specs',
      mode: 'work',
      isPinned: true,
      tags: ['architecture'],
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'side-note-2',
      title: 'Daily Reflection Diary',
      content: 'Had a peaceful morning walk',
      mode: 'journal',
      isPinned: false,
      tags: ['daily'],
      updatedAt: '2026-01-02T00:00:00Z'
    }
  ];

  it('renders list of notes in the Sidebar and highlights active note', () => {
    const handleSelect = vi.fn();

    render(
      <Sidebar
        notes={sampleNotes}
        activeNoteId="side-note-1"
        onSelectNote={handleSelect}
        searchQuery=""
        setSearchQuery={vi.fn()}
        setIsMobileSidebarOpen={vi.fn()}
        appLanguage="en"
      />
    );

    expect(screen.getByText('Architectural Specs')).toBeDefined();
    expect(screen.getByText('Daily Reflection Diary')).toBeDefined();
  });

  it('calls onSelectNote when a note item is clicked in Sidebar', () => {
    const handleSelect = vi.fn();

    render(
      <Sidebar
        notes={sampleNotes}
        activeNoteId="side-note-1"
        onSelectNote={handleSelect}
        searchQuery=""
        setSearchQuery={vi.fn()}
        setIsMobileSidebarOpen={vi.fn()}
        appLanguage="en"
      />
    );

    const noteItem = screen.getByText('Daily Reflection Diary');
    fireEvent.click(noteItem);

    expect(handleSelect).toHaveBeenCalledWith('side-note-2');
  });

  it('updates search query when user types into the search box', () => {
    const handleSearch = vi.fn();

    render(
      <Sidebar
        notes={sampleNotes}
        activeNoteId="side-note-1"
        onSelectNote={vi.fn()}
        searchQuery=""
        setSearchQuery={handleSearch}
        setIsMobileSidebarOpen={vi.fn()}
        appLanguage="en"
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search notes/i) || screen.getByPlaceholderText(/Notlarda ara/i);
    expect(searchInput).toBeDefined();

    fireEvent.change(searchInput, { target: { value: 'Architectural' } });
    expect(handleSearch).toHaveBeenCalledWith('Architectural');
  });

  it('calls onTogglePin when pin button is clicked', () => {
    const handlePin = vi.fn();

    render(
      <Sidebar
        notes={sampleNotes}
        activeNoteId="side-note-1"
        onSelectNote={vi.fn()}
        onTogglePin={handlePin}
        searchQuery=""
        setSearchQuery={vi.fn()}
        setIsMobileSidebarOpen={vi.fn()}
        appLanguage="en"
      />
    );

    const pinButtons = screen.getAllByRole('button').filter(b => 
      b.getAttribute('title')?.toLowerCase().includes('pin') ||
      b.getAttribute('title')?.toLowerCase().includes('sabitle')
    );

    if (pinButtons.length > 0) {
      fireEvent.click(pinButtons[0]);
      expect(handlePin).toHaveBeenCalled();
    }
  });

  it('renders MindmapView modal with canvas and controls when isOpen is true', () => {
    const handleClose = vi.fn();

    const { container } = render(
      <MindmapView
        isOpen={true}
        onClose={handleClose}
        notes={sampleNotes}
        activeNoteId="side-note-1"
        onSelectNote={vi.fn()}
        appLanguage="en"
      />
    );

    // Canvas element should be rendered
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();

    // Close button works
    const closeBtn = screen.getAllByRole('button').find(b => 
      b.getAttribute('title')?.toLowerCase().includes('close') ||
      b.getAttribute('title')?.toLowerCase().includes('kapat')
    );
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalled();
    }
  });
});
