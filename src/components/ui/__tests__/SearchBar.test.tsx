import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SearchBar } from '@/components/ui/SearchBar'

// Mock the useAutocomplete hook
jest.mock('@/hooks/useItems', () => ({
  useAutocomplete: () => ({
    suggestions: ['nature', 'landscape', 'photography'],
    isLoading: false,
    clearSuggestions: jest.fn(),
  })
}))

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input correctly', () => {
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange} 
        onSearch={mockOnSearch} 
        placeholder="Search for photos, designs..."
      />
    )
    
    expect(screen.getByPlaceholderText('Search for photos, designs...')).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange} 
        onSearch={mockOnSearch} 
        placeholder="Search for photos, designs..."
      />
    )
    
    const input = screen.getByPlaceholderText('Search for photos, designs...')
    fireEvent.change(input, { target: { value: 'nature' } })
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('nature')
    }, { timeout: 350 })
  })

  it('has proper accessibility attributes', () => {
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange} 
        onSearch={mockOnSearch} 
        placeholder="Search for photos, designs..."
      />
    )
    
    const input = screen.getByPlaceholderText('Search for photos, designs...')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('shows suggestions when typing', async () => {
    render(
      <SearchBar 
        value="nat" 
        onChange={mockOnChange} 
        onSearch={mockOnSearch} 
        placeholder="Search for photos, designs..."
      />
    )
    
    const input = screen.getByPlaceholderText('Search for photos, designs...')
    fireEvent.focus(input)
    
    await waitFor(() => {
      expect(screen.getByText('nature')).toBeInTheDocument()
    })
  })
})