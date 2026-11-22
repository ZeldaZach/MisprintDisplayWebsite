import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DisplayCard from '../DisplayCard';
import { DatabaseEntry } from '../../types/databaseEntry';
import { SortOption } from '../../types/SortOption';

// Mock the useLazyImage hook
vi.mock('../../hooks/useLazyImage', () => ({
  useLazyImage: vi.fn((src: string) => ({
    imageSrc: src,
    isLoading: false,
    isError: false,
    imgRef: { current: null },
  })),
}));

describe('DisplayCard', () => {
  const mockCard: DatabaseEntry = {
    UUID: 'test-uuid-123',
    PrimaryCardName: 'Black Lotus',
    SecondaryCardName: '',
    SetCode: 'LEA',
    Errors: 'Miscut',
    Picture: 'resources/images-large/https-www-dropbox-com-s-abc123-test-jpeg-dl-1.jpeg',
    Language: 'English',
    ArrivalDate: '2023-01-15',
  };

  const mockSortState: SortOption = {
    key: 'ArrivalDate',
    direction: 'DESC',
    maxImageWidth: 'large',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render card with primary name', () => {
      render(<DisplayCard card={mockCard} sortState={mockSortState} />);

      expect(screen.getByText('Black Lotus')).toBeInTheDocument();
    });

    it('should render card with both primary and secondary names', () => {
      const cardWithSecondary = {
        ...mockCard,
        SecondaryCardName: 'Fire',
      };

      render(<DisplayCard card={cardWithSecondary} sortState={mockSortState} />);

      expect(screen.getByText('Black Lotus // Fire')).toBeInTheDocument();
    });

    it('should render all metadata fields', () => {
      render(<DisplayCard card={mockCard} sortState={mockSortState} />);

      expect(screen.getByText(/Set Code: LEA/)).toBeInTheDocument();
      expect(screen.getByText(/Error: Miscut/)).toBeInTheDocument();
      expect(screen.getByText(/UUID: test-uuid-123/)).toBeInTheDocument();
      expect(screen.getByText(/Language: English/)).toBeInTheDocument();
      expect(screen.getByText(/Arrival Date: 2023-01-15/)).toBeInTheDocument();
    });

    it('should not render optional fields when missing', () => {
      const minimalCard: DatabaseEntry = {
        UUID: 'test-uuid',
        PrimaryCardName: 'Test Card',
        Errors: 'Test Error',
        Picture: 'test.jpg',
      };

      render(<DisplayCard card={minimalCard} sortState={mockSortState} />);

      expect(screen.queryByText(/Set Code:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Language:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Arrival Date:/)).not.toBeInTheDocument();
    });

    it('should render with correct image src based on maxImageWidth', () => {
      render(<DisplayCard card={mockCard} sortState={mockSortState} />);

      const img = screen.getByAltText('Black Lotus') as HTMLImageElement;
      expect(img.src).toContain('resources/images-large/https-www-dropbox-com-s-abc123-test-jpeg-dl-1.jpeg');
    });

    it('should transform image src for different sizes', () => {
      const sortState300: SortOption = {
        ...mockSortState,
        maxImageWidth: '300px',
      };

      const { rerender } = render(<DisplayCard card={mockCard} sortState={sortState300} />);

      let img = screen.getByAltText('Black Lotus') as HTMLImageElement;
      expect(img.src).toContain('resources/images-300px/https-www-dropbox-com-s-abc123-test-jpeg-dl-1.webp');

      const sortState750: SortOption = {
        ...mockSortState,
        maxImageWidth: '750px',
      };

      rerender(<DisplayCard card={mockCard} sortState={sortState750} />);

      img = screen.getByAltText('Black Lotus') as HTMLImageElement;
      expect(img.src).toContain('resources/images-750px/https-www-dropbox-com-s-abc123-test-jpeg-dl-1.webp');
    });
  });

  describe('Image Click Handler', () => {
    it('should call onImageClick with large src when clicked', () => {
      const onImageClick = vi.fn();

      render(
        <DisplayCard
          card={mockCard}
          sortState={mockSortState}
          onImageClick={onImageClick}
        />
      );

      const img = screen.getByAltText('Black Lotus');
      fireEvent.click(img);

      expect(onImageClick).toHaveBeenCalledWith(
        'resources/images-large/https-www-dropbox-com-s-abc123-test-jpeg-dl-1.jpeg',
        'Black Lotus'
      );
    });

    it('should call onImageClick when Enter key is pressed', () => {
      const onImageClick = vi.fn();

      render(
        <DisplayCard
          card={mockCard}
          sortState={mockSortState}
          onImageClick={onImageClick}
        />
      );

      const img = screen.getByAltText('Black Lotus');
      fireEvent.keyDown(img, { key: 'Enter' });

      expect(onImageClick).toHaveBeenCalledWith(
        'resources/images-large/https-www-dropbox-com-s-abc123-test-jpeg-dl-1.jpeg',
        'Black Lotus'
      );
    });

    it('should call onImageClick when Space key is pressed', () => {
      const onImageClick = vi.fn();

      render(
        <DisplayCard
          card={mockCard}
          sortState={mockSortState}
          onImageClick={onImageClick}
        />
      );

      const img = screen.getByAltText('Black Lotus');
      fireEvent.keyDown(img, { key: ' ' });

      expect(onImageClick).toHaveBeenCalledWith(
        'resources/images-large/https-www-dropbox-com-s-abc123-test-jpeg-dl-1.jpeg',
        'Black Lotus'
      );
    });

    it('should not call onImageClick for other keys', () => {
      const onImageClick = vi.fn();

      render(
        <DisplayCard
          card={mockCard}
          sortState={mockSortState}
          onImageClick={onImageClick}
        />
      );

      const img = screen.getByAltText('Black Lotus');
      fireEvent.keyDown(img, { key: 'a' });
      fireEvent.keyDown(img, { key: 'Escape' });

      expect(onImageClick).not.toHaveBeenCalled();
    });

    it('should have proper accessibility attributes when clickable', () => {
      const onImageClick = vi.fn();

      render(
        <DisplayCard
          card={mockCard}
          sortState={mockSortState}
          onImageClick={onImageClick}
        />
      );

      const img = screen.getByAltText('Black Lotus');

      expect(img).toHaveAttribute('role', 'button');
      expect(img).toHaveAttribute('tabIndex', '0');
      expect(img).toHaveAttribute('aria-label', 'View Black Lotus in fullscreen');
      expect(img).toHaveStyle({ cursor: 'pointer' });
    });

    it('should not have button attributes when not clickable', () => {
      render(<DisplayCard card={mockCard} sortState={mockSortState} />);

      const img = screen.getByAltText('Black Lotus');

      expect(img).not.toHaveAttribute('role');
      expect(img).not.toHaveAttribute('tabIndex');
      expect(img).toHaveStyle({ cursor: 'default' });
    });
  });

  describe('Error State', () => {
    it('should display error message when image fails to load', async () => {
      const { useLazyImage } = await import('../../hooks/useLazyImage');

      vi.mocked(useLazyImage).mockReturnValue({
        imageSrc: '',
        isLoading: false,
        isError: true,
        imgRef: { current: null },
      });

      render(<DisplayCard card={mockCard} sortState={mockSortState} />);

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Failed to load image for Black Lotus');
    });

    it('should not display image when error state is true', async () => {
      const { useLazyImage } = await import('../../hooks/useLazyImage');

      vi.mocked(useLazyImage).mockReturnValue({
        imageSrc: '',
        isLoading: false,
        isError: true,
        imgRef: { current: null },
      });

      render(<DisplayCard card={mockCard} sortState={mockSortState} />);

      expect(screen.queryByAltText('Black Lotus')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show placeholder when loading', async () => {
      const { useLazyImage } = await import('../../hooks/useLazyImage');

      vi.mocked(useLazyImage).mockReturnValue({
        imageSrc: '',
        isLoading: true,
        isError: false,
        imgRef: { current: null },
      });

      const { container } = render(
        <DisplayCard card={mockCard} sortState={mockSortState} />
      );

      const placeholder = container.querySelector('[class*="placeholder"]');
      expect(placeholder).not.toBeNull();
    });

    it('should set image opacity to 0 when loading', async () => {
      const { useLazyImage } = await import('../../hooks/useLazyImage');

      vi.mocked(useLazyImage).mockReturnValue({
        imageSrc: 'test.jpg',
        isLoading: true,
        isError: false,
        imgRef: { current: null },
      });

      render(<DisplayCard card={mockCard} sortState={mockSortState} />);

      const img = screen.getByAltText('Black Lotus');
      expect(img).toHaveStyle({ opacity: 0 });
    });
  });

  describe('Memoization', () => {
    it('should have displayName set for debugging', () => {
      expect(DisplayCard.displayName).toBe('DisplayCard');
    });
  });

  describe('Card ID', () => {
    it('should set card ID to UUID', () => {
      const { container } = render(
        <DisplayCard card={mockCard} sortState={mockSortState} />
      );

      const card = container.querySelector('#test-uuid-123');
      expect(card).toBeInTheDocument();
    });
  });
});
