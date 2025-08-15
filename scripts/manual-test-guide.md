# Manual Testing Guide for Watchlist Feature

This guide provides step-by-step instructions for manually testing the complete watchlist functionality to verify all requirements are met.

## Prerequisites

1. Start the development server:
   ```bash
   npm start
   ```

2. Run on your preferred platform:
   ```bash
   # For Android TV/Fire TV
   npm run android
   
   # For tvOS
   npm run ios
   
   # For web testing
   npm run web
   ```

## Test Scenarios

### 1. Complete User Flow Test (Requirements 1.1, 1.2, 2.1, 2.2, 4.1, 4.4)

**Objective**: Test the complete flow from browsing to adding items to watchlist

**Steps**:
1. **Browse Content**:
   - Navigate to the home screen
   - Use D-pad to browse through the movie grid
   - Verify focus states work correctly
   - Notice that no watchlist indicators are visible (empty watchlist)

2. **View Details**:
   - Select any movie from the grid
   - Verify navigation to details screen
   - Locate the "Add to Watchlist" button next to "Watch now"
   - Verify button is focusable with D-pad navigation

3. **Add to Watchlist**:
   - Select the "Add to Watchlist" button
   - Verify loading state appears briefly
   - Verify button changes to "Remove from Watchlist"
   - Verify success feedback is shown

4. **View Watchlist**:
   - Navigate back to home (use back button or drawer)
   - Open drawer navigation (left arrow or menu button)
   - Select "Watchlist" from the drawer menu
   - Verify the item appears in the watchlist grid
   - Verify item count is shown in header ("1 item saved")

**Expected Results**:
- ✅ Smooth navigation between screens
- ✅ Button state changes correctly
- ✅ Item appears in watchlist immediately
- ✅ Visual feedback for all actions

### 2. Visual Indicators Test (Requirements 6.1, 6.4, 6.5)

**Objective**: Verify watchlist indicators appear on home screen

**Steps**:
1. After adding an item to watchlist (from Test 1)
2. Navigate back to home screen
3. Browse the movie grid
4. Look for the golden bookmark indicator on the item you added

**Expected Results**:
- ✅ Golden bookmark icon appears in top-right corner of watchlist items
- ✅ Indicator is clearly visible during focus and unfocus states
- ✅ Indicator doesn't interfere with navigation
- ✅ Only items in watchlist show the indicator

### 3. Remove from Watchlist Test (Requirements 2.1, 2.2, 2.3, 2.4, 2.5)

**Objective**: Test removing items from watchlist

**Method 1 - From Details Screen**:
1. Navigate to details of an item that's in your watchlist
2. Verify button shows "Remove from Watchlist"
3. Select the button
4. Verify confirmation and button changes to "Add to Watchlist"

**Method 2 - From Watchlist Screen**:
1. Navigate to watchlist screen
2. Focus on any item in the grid
3. Look for the red "✕" button in top-right corner of item
4. Select the remove button
5. Verify confirmation dialog appears
6. Select "Remove" to confirm
7. Verify item disappears from grid immediately

**Expected Results**:
- ✅ Both removal methods work correctly
- ✅ Confirmation dialog appears for watchlist screen removal
- ✅ Item removed immediately from all screens
- ✅ Visual indicators update across all screens

### 4. Empty State Test (Requirements 4.5, 2.5)

**Objective**: Test empty watchlist state

**Steps**:
1. Remove all items from your watchlist (use Test 3 methods)
2. Navigate to watchlist screen
3. Verify empty state is displayed

**Expected Results**:
- ✅ Friendly empty state message appears
- ✅ Guidance text explains how to add items
- ✅ Header shows "No items saved yet"
- ✅ Screen remains navigable

### 5. Drawer Navigation Test (Requirements 3.1, 3.2, 3.3, 3.4)

**Objective**: Test watchlist access via drawer navigation

**Steps**:
1. From any screen, open drawer navigation:
   - Use left arrow key when at leftmost position
   - Or use menu button if available
2. Verify "Watchlist" appears in menu items
3. Navigate to "Watchlist" using D-pad
4. Verify focus states work correctly
5. Select "Watchlist"
6. Verify navigation to watchlist screen

**Expected Results**:
- ✅ "Watchlist" menu item is visible and accessible
- ✅ Focus states work correctly in drawer
- ✅ Selection navigates to watchlist screen
- ✅ Drawer closes after selection

### 6. Persistence Test (Requirements 5.1, 5.2, 5.3, 5.4, 5.5)

**Objective**: Verify watchlist data persists across app restarts

**Steps**:
1. Add 2-3 items to your watchlist
2. Verify items appear in watchlist screen
3. Close the app completely (not just minimize)
4. Restart the app
5. Navigate to watchlist screen
6. Verify all items are still present

**Expected Results**:
- ✅ All watchlist items persist after app restart
- ✅ Items load within 2 seconds of app start
- ✅ No data loss occurs
- ✅ Visual indicators still appear on home screen

### 7. Cross-Screen State Synchronization Test

**Objective**: Verify state updates across all screens simultaneously

**Steps**:
1. Add an item to watchlist from details screen
2. Navigate to home screen - verify indicator appears
3. Navigate to watchlist screen - verify item is there
4. Remove item from watchlist screen
5. Navigate to home screen - verify indicator disappears
6. Navigate to details screen - verify button shows "Add to Watchlist"

**Expected Results**:
- ✅ State updates immediately across all screens
- ✅ No inconsistencies between screens
- ✅ Visual indicators update in real-time

### 8. TV Remote Control Navigation Test (Requirements 1.5, 3.4, 4.3, 6.4, 6.5)

**Objective**: Verify all functionality works with TV remote controls

**Navigation Tests**:
- ✅ D-pad navigation works in all directions
- ✅ Select/OK button activates focused elements
- ✅ Back button returns to previous screen
- ✅ Menu button opens drawer (if available)

**Focus Management Tests**:
- ✅ Focus moves logically between elements
- ✅ Focus states are clearly visible
- ✅ No focus traps or unreachable elements
- ✅ Focus remembers position when returning to screens

### 9. Error Handling Test (Requirements 1.3, 2.3, 5.4)

**Objective**: Test error scenarios and recovery

**Simulated Tests** (for development):
1. Disconnect internet during watchlist operation
2. Fill device storage completely
3. Corrupt watchlist data

**Expected Results**:
- ✅ User-friendly error messages appear
- ✅ Retry functionality works
- ✅ App doesn't crash on errors
- ✅ Graceful degradation when storage unavailable

### 10. Performance Test (Requirements 5.3, 1.3, 2.3)

**Objective**: Verify performance with various data sizes

**Steps**:
1. Add 10+ items to watchlist
2. Navigate between screens
3. Test scrolling in watchlist screen
4. Test add/remove operations

**Expected Results**:
- ✅ Smooth animations and transitions
- ✅ No lag during navigation
- ✅ Responsive UI updates
- ✅ Efficient memory usage

## Checklist Summary

After completing all tests, verify:

- [ ] Complete user flow works end-to-end
- [ ] Visual indicators appear and update correctly
- [ ] Both removal methods work (details + watchlist screen)
- [ ] Empty state displays properly
- [ ] Drawer navigation includes and accesses watchlist
- [ ] Data persists across app restarts
- [ ] State synchronizes across all screens
- [ ] TV remote control navigation works perfectly
- [ ] Error handling is user-friendly
- [ ] Performance is smooth with multiple items

## Troubleshooting

If any test fails:

1. Check console logs for errors
2. Verify all required files are present
3. Ensure AsyncStorage is working properly
4. Test on different platforms (Android TV, tvOS, Web)
5. Clear app data and test fresh installation

## Success Criteria

All tests must pass for the watchlist feature to be considered complete and ready for production deployment.