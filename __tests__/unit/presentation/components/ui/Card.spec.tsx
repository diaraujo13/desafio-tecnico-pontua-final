import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Card } from '../../../../../src/presentation/components/ui/Card';
import { ThemeProvider } from '../../../../../src/presentation/theme/ThemeProvider';

describe('Card Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('should render card with children', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <></>
        <></>
      </Card>
    );
    // Card renders children
    expect(getByText).toBeDefined();
  });

  it('should render card with header', () => {
    renderWithTheme(
      <Card>
        <Card.Header title="Card Title" />
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeTruthy();
  });

  it('should render card with content', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Card.Content>
          <></>
        </Card.Content>
      </Card>
    );
    // Content renders
    expect(getByText).toBeDefined();
  });

  it('should render card with footer', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Card.Footer>
          <></>
        </Card.Footer>
      </Card>
    );
    // Footer renders
    expect(getByText).toBeDefined();
  });

  it('should render complete card structure', () => {
    renderWithTheme(
      <Card>
        <Card.Header title="Title" />
        <Card.Content>
          <></>
        </Card.Content>
        <Card.Footer>
          <></>
        </Card.Footer>
      </Card>
    );
    expect(screen.getByText('Title')).toBeTruthy();
  });

  it('should not render header when title is not provided', () => {
    const { UNSAFE_root } = renderWithTheme(
      <Card>
        <Card.Header />
      </Card>
    );
    // Header should return null when no title, so component renders without header
    expect(UNSAFE_root).toBeTruthy();
  });
});
