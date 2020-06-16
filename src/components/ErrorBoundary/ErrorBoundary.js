import React from 'react';

const FallbackComponent = ({ error, resetError }) => {
  return (
    <View>
      <Text>Something happened!</Text>
      <Text>{error.toString()}</Text>
      <Button onPress={resetError} title={'Try again'} />
    </View>
  );
};

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.log('ERROR BOUNDARY', error, info.componentStack);
  }

  resetError = () => this.state({ error: false });

  render() {
    if (this.state.hasError) {
      <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
