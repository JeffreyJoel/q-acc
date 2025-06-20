# Loading States Implementation Guide

## Overview
This guide provides a comprehensive approach for implementing loading states across all buttons in the q-acc codebase.

## Enhanced Button Component

The base `Button` component (`src/components/ui/button.tsx`) has been enhanced with built-in loading state support:

### New Props
- `loading?: boolean` - Shows spinner and disables button when true
- `loadingText?: string` - Optional text to display during loading state

### Usage Examples
```tsx
// Basic loading state
<Button 
  loading={isSubmitting} 
  loadingText="Saving..."
  onClick={handleSubmit}
>
  Save Profile
</Button>

// Loading without custom text (uses original children)
<Button 
  loading={isLoading}
  onClick={handleAction}
>
  Submit
</Button>
```

## Updated Components

### 1. Button Component (`src/components/ui/button.tsx`)
- ✅ Added `loading` and `loadingText` props
- ✅ Integrated Loader2 spinner from lucide-react
- ✅ Automatic disabling when loading

### 2. SupportButton (`src/components/project/SupportButton.tsx`)
- ✅ Added loading state for NFT ownership verification
- ✅ Shows "Checking access..." during async operations

### 3. WalletConnect (`src/components/shared/WalletConnect.tsx`)
- ✅ Added loading state for wallet connection
- ✅ Shows "Connecting..." during login process

### 4. DonatePageBody (`src/components/donate/DonatePageBody.tsx`)
- ✅ Enhanced donate button with loading states
- ✅ Added refresh button loading with spin animation
- ✅ Proper loading text based on operation type

### 5. CreateProfile (`src/components/profile/CreateProfile.tsx`)
- ✅ Updated profile creation button to use new loading pattern
- ✅ Removed manual Loader2 implementation

### 6. UpdateProfileModal (`src/components/modals/UpdateProfileModal.tsx`)
- ✅ Added loading states for profile updates
- ✅ Enhanced OTP verification button

### 7. SignModal (`src/components/modals/SignModal.tsx`)
- ✅ Updated message signing button with loading state

## Implementation Patterns

### For Form Submissions
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    await submitForm();
  } catch (error) {
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};

<Button 
  loading={isSubmitting}
  loadingText="Submitting..."
  onClick={handleSubmit}
>
  Submit
</Button>
```

### For API Calls
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleApiCall = async () => {
  setIsLoading(true);
  try {
    const result = await apiCall();
    // handle result
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

<Button 
  loading={isLoading}
  loadingText="Processing..."
  onClick={handleApiCall}
>
  Action
</Button>
```

### For Navigation/Routing
```tsx
const [isNavigating, setIsNavigating] = useState(false);

const handleNavigation = async () => {
  setIsNavigating(true);
  try {
    // Check permissions or validate
    await checkAccess();
    router.push('/destination');
  } catch (error) {
    console.error(error);
    setIsNavigating(false); // Only reset on error, success navigates away
  }
};

<Button 
  loading={isNavigating}
  loadingText="Checking access..."
  onClick={handleNavigation}
>
  Continue
</Button>
```

## Remaining Components to Update

### High Priority
1. **Project Creation Forms** - Add loading states to creation/submission buttons
2. **Payment/Transaction Buttons** - Critical for user feedback during blockchain operations
3. **Authentication Flows** - Login, logout, verification buttons
4. **File Upload Components** - Show progress during uploads

### Medium Priority
1. **Search/Filter Buttons** - For better UX during data fetching
2. **Modal Action Buttons** - Confirmation, cancellation with async operations
3. **Settings/Configuration** - Update settings buttons
4. **Export/Import Functions** - Data processing operations

### Low Priority
1. **Table Action Buttons** - Only if they perform async operations
2. **Navigation Buttons** - Simple page transitions (usually instant)
3. **Toggle/Switch Buttons** - Immediate state changes

## Best Practices

### 1. Consistent Loading Text
- Use action-specific text: "Saving...", "Loading...", "Connecting..."
- Keep text concise and descriptive
- Use present continuous tense (-ing verbs)

### 2. Error Handling
- Always wrap async operations in try-catch
- Reset loading state in finally block
- Provide user feedback on errors

### 3. Accessibility
- Loading states automatically disable buttons (prevents double-clicks)
- Screen readers announce loading state changes
- Visual spinner provides clear feedback

### 4. Performance
- Only add loading states where actually needed
- Avoid loading states for instant operations
- Consider skeleton loaders for longer operations

## Testing Checklist

- [ ] Button becomes disabled during loading
- [ ] Spinner appears and rotates
- [ ] Loading text displays correctly
- [ ] Loading state resets after operation
- [ ] Error handling works properly
- [ ] No double-click issues
- [ ] Accessible to screen readers

## Migration Strategy

1. **Identify async operations** - Find all buttons that trigger async functions
2. **Add loading state** - Add useState for loading state
3. **Update handlers** - Wrap async operations with loading state management
4. **Update JSX** - Add loading and loadingText props to Button components
5. **Test thoroughly** - Verify all scenarios work correctly

This implementation provides a consistent, accessible, and user-friendly approach to loading states throughout the application. 