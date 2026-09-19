/** Shared expo-router stand-in for unit tests. Import `mockRouter` to assert on navigation. */
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  navigate: jest.fn(),
  dismissAll: jest.fn(),
};

export const useLocalSearchParams = jest.fn(() => ({}));

export const useRouter = () => mockRouter;
export const router = mockRouter;
export const Link = ({ children }: { children?: unknown }) => children ?? null;
export const Redirect = () => null;
