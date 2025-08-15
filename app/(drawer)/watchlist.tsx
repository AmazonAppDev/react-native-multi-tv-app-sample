import { StyleSheet, FlatList, View, Image, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useState, useMemo } from 'react';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { useMenuContext } from '../../components/MenuContext';
import { useWatchlist } from '../../components/WatchlistContext';
import EmptyWatchlistState from '../../components/EmptyWatchlistState';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import ErrorDialog from '../../components/ErrorDialog';
import ToastNotification from '../../components/ToastNotification';
import { WatchlistSkeleton } from '../../components/SkeletonLoader';
import LoadingIndicator from '../../components/LoadingIndicator';
import {
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationNode,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../../hooks/useScale';
import { WatchlistItem } from '../../types/watchlist';
import { useLazyWatchlist } from '../../hooks/useLazyWatchlist';

// Memoized watchlist item component for better performance with large lists
const WatchlistItemComponent = React.memo<{
  item: WatchlistItem;
  onSelect: (item: WatchlistItem) => void;
  onRemove: (item: WatchlistItem) => void;
}>(({ item, onSelect, onRemove }) => {
  const styles = useWatchlistStyles();

  const handleSelect = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  const handleRemove = useCallback(() => {
    onRemove(item);
  }, [item, onRemove]);

  return (
    <View style={styles.watchlistItemContainer}>
      <SpatialNavigationFocusableView onSelect={handleSelect}>
        {({ isFocused }) => (
          <View style={[styles.watchlistItem, isFocused && styles.watchlistItemFocused]}>
            <Image source={{ uri: item.headerImage }} style={styles.itemImage} />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              {item.duration && <Text style={styles.itemDuration}>{item.duration} min</Text>}
            </View>
          </View>
        )}
      </SpatialNavigationFocusableView>

      {/* Remove button */}
      <SpatialNavigationFocusableView onSelect={handleRemove}>
        {({ isFocused }) => (
          <View style={[styles.removeButton, isFocused && styles.removeButtonFocused]}>
            <Text style={[styles.removeButtonText, isFocused && styles.removeButtonTextFocused]}>✕</Text>
          </View>
        )}
      </SpatialNavigationFocusableView>
    </View>
  );
});

WatchlistItemComponent.displayName = 'WatchlistItemComponent';

export default function WatchlistScreen() {
  const styles = useWatchlistStyles();
  const router = useRouter();
  const navigation = useNavigation();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const { watchlist, isLoading, error, isRetrying, removeFromWatchlist, retryLoadWatchlist, clearError } =
    useWatchlist();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  // Lazy loading for large datasets (>100 items)
  const shouldUseLazyLoading = watchlist.length > 100;
  const lazyWatchlist = useLazyWatchlist(watchlist, {
    pageSize: 20,
    preloadPages: 1,
    enableVirtualization: shouldUseLazyLoading,
  });

  const displayItems = shouldUseLazyLoading ? lazyWatchlist.visibleItems : watchlist;

  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<WatchlistItem | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      console.log('Direction ' + movement);
      if (movement === 'left') {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, navigation],
  );

  // Handle remove item confirmation
  const handleRemoveItem = useCallback((item: WatchlistItem) => {
    setItemToRemove(item);
    setShowConfirmDialog(true);
  }, []);

  // Confirm removal
  const confirmRemoval = useCallback(async () => {
    if (!itemToRemove) return;

    setIsRemoving(true);
    try {
      await removeFromWatchlist(itemToRemove.id);
      setShowConfirmDialog(false);
      setItemToRemove(null);

      // Show success toast
      setToastMessage('Item removed from watchlist');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setShowConfirmDialog(false);
      setItemToRemove(null);

      // Show error toast
      setToastMessage('Failed to remove item. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsRemoving(false);
    }
  }, [itemToRemove, removeFromWatchlist]);

  // Cancel removal
  const cancelRemoval = useCallback(() => {
    setShowConfirmDialog(false);
    setItemToRemove(null);
  }, []);

  // Memoize header to prevent unnecessary re-renders
  const headerSubtitle = useMemo(() => {
    const totalItems = shouldUseLazyLoading ? lazyWatchlist.totalItems : watchlist.length;
    const loadedItems = shouldUseLazyLoading ? lazyWatchlist.visibleItems.length : watchlist.length;

    if (totalItems === 0) {
      return 'No items saved yet';
    }

    if (shouldUseLazyLoading && loadedItems < totalItems) {
      return `${loadedItems} of ${totalItems} items loaded`;
    }

    return `${totalItems} ${totalItems === 1 ? 'item' : 'items'} saved`;
  }, [watchlist.length, shouldUseLazyLoading, lazyWatchlist.totalItems, lazyWatchlist.visibleItems.length]);

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Watchlist</Text>
        <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
      </View>
    ),
    [headerSubtitle, styles],
  );

  // Optimized handlers for better performance
  const handleItemSelect = useCallback(
    (item: WatchlistItem) => {
      router.push({
        pathname: '/details',
        params: {
          id: item.id.toString(),
          title: item.title,
          description: item.description,
          headerImage: item.headerImage,
          movie: item.movie,
        },
      });
    },
    [router],
  );

  const renderWatchlistItem = useCallback(
    ({ item }: { item: WatchlistItem }) => (
      <WatchlistItemComponent item={item} onSelect={handleItemSelect} onRemove={handleRemoveItem} />
    ),
    [handleItemSelect, handleRemoveItem],
  );

  // Memoize FlatList key extractor for better performance
  const keyExtractor = useCallback((item: WatchlistItem) => item.id.toString(), []);

  // Memoize getItemLayout for better scrolling performance
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: scaledPixels(300), // Item height + margin
      offset: scaledPixels(300) * Math.floor(index / 4), // Row height * row index
      index,
    }),
    [],
  );

  const renderWatchlistGrid = useCallback(() => {
    if (watchlist.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <EmptyWatchlistState />
        </View>
      );
    }

    return (
      <SpatialNavigationNode>
        <DefaultFocus>
          <FlatList
            data={displayItems}
            renderItem={renderWatchlistItem}
            keyExtractor={keyExtractor}
            numColumns={4}
            key="watchlist-grid"
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            style={styles.flatListContainer}
            // Add header component instead of separate header
            ListHeaderComponent={renderHeader}
            // Performance optimizations for large lists
            removeClippedSubviews={shouldUseLazyLoading}
            maxToRenderPerBatch={shouldUseLazyLoading ? 8 : 16}
            updateCellsBatchingPeriod={shouldUseLazyLoading ? 50 : 100}
            initialNumToRender={shouldUseLazyLoading ? 12 : 20}
            windowSize={shouldUseLazyLoading ? 10 : 21}
            getItemLayout={shouldUseLazyLoading ? lazyWatchlist.getItemLayout : undefined}
            // Lazy loading for very large lists
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (shouldUseLazyLoading && lazyWatchlist.hasMore && !lazyWatchlist.isLoading) {
                console.log('Loading more watchlist items...');
                lazyWatchlist.loadMore();
              }
            }}
            // Loading footer for lazy loading
            ListFooterComponent={
              shouldUseLazyLoading && lazyWatchlist.isLoading ? (
                <View style={styles.loadingFooter}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.loadingFooterText}>Loading more items...</Text>
                </View>
              ) : null
            }
          />
        </DefaultFocus>
      </SpatialNavigationNode>
    );
  }, [
    watchlist.length,
    displayItems,
    renderWatchlistItem,
    keyExtractor,
    shouldUseLazyLoading,
    lazyWatchlist,
    styles,
    renderHeader,
  ]);

  // Enhanced loading state with skeleton loader for better perceived performance
  if (isLoading) {
    return (
      <SpatialNavigationRoot isActive={isActive}>
        <WatchlistSkeleton itemCount={12} />
        {isRetrying && <LoadingIndicator type="overlay" message="Retrying..." showAnimatedDots={true} />}
      </SpatialNavigationRoot>
    );
  }

  return (
    <SpatialNavigationRoot
      isActive={isActive && !showConfirmDialog && !error}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={styles.container}>{renderWatchlistGrid()}</View>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={showConfirmDialog}
        title="Remove from Watchlist"
        message={`Are you sure you want to remove "${itemToRemove?.title}" from your watchlist?`}
        confirmText={isRemoving ? 'Removing...' : 'Remove'}
        cancelText="Cancel"
        onConfirm={confirmRemoval}
        onCancel={cancelRemoval}
      />

      {/* Error Dialog */}
      <ErrorDialog
        visible={!!error && !isLoading}
        title="Watchlist Error"
        message={error || ''}
        showRetry={true}
        isRetrying={isRetrying}
        onRetry={retryLoadWatchlist}
        onDismiss={clearError}
      />

      {/* Toast Notification */}
      <ToastNotification
        visible={showToast}
        message={toastMessage}
        type={toastType}
        duration={3000}
        onHide={() => setShowToast(false)}
      />
    </SpatialNavigationRoot>
  );
}

const useWatchlistStyles = function () {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    flatListContainer: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      backgroundColor: 'black',
    },
    header: {
      paddingHorizontal: scaledPixels(40),
      paddingVertical: scaledPixels(60),
      backgroundColor: 'black',
    },
    headerTitle: {
      color: '#fff',
      fontSize: scaledPixels(48),
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    headerSubtitle: {
      color: '#fff',
      fontSize: scaledPixels(24),
      fontWeight: '500',
      paddingTop: scaledPixels(16),
      opacity: 0.8,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },

    gridContent: {
      paddingHorizontal: scaledPixels(20),
      paddingBottom: scaledPixels(40),
    },
    watchlistItemContainer: {
      position: 'relative',
      marginRight: scaledPixels(20),
      marginBottom: scaledPixels(20),
    },
    watchlistItem: {
      width: scaledPixels(300),
      height: scaledPixels(280),
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: scaledPixels(5),
      overflow: 'hidden',
    },
    watchlistItemFocused: {
      borderColor: '#fff',
      borderWidth: scaledPixels(4),
    },
    removeButton: {
      position: 'absolute',
      top: scaledPixels(10),
      right: scaledPixels(10),
      width: scaledPixels(40),
      height: scaledPixels(40),
      backgroundColor: 'rgba(255, 0, 0, 0.8)',
      borderRadius: scaledPixels(20),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: scaledPixels(2),
      borderColor: 'transparent',
    },
    removeButtonFocused: {
      backgroundColor: '#fff',
      borderColor: '#fff',
    },
    removeButtonText: {
      color: '#fff',
      fontSize: scaledPixels(20),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    removeButtonTextFocused: {
      color: '#ff0000',
    },
    itemImage: {
      width: '100%',
      height: scaledPixels(200),
      resizeMode: 'cover',
    },
    itemTextContainer: {
      padding: scaledPixels(15),
      flex: 1,
      justifyContent: 'space-between',
    },
    itemTitle: {
      color: '#fff',
      fontSize: scaledPixels(18),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    itemDuration: {
      color: '#fff',
      fontSize: scaledPixels(14),
      textAlign: 'center',
      opacity: 0.7,
      marginTop: scaledPixels(5),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scaledPixels(40),
    },
    loadingSpinner: {
      marginBottom: scaledPixels(20),
    },
    loadingText: {
      color: '#fff',
      fontSize: scaledPixels(24),
      textAlign: 'center',
      fontWeight: '600',
    },
    loadingSubtext: {
      color: '#fff',
      fontSize: scaledPixels(18),
      textAlign: 'center',
      opacity: 0.7,
      marginTop: scaledPixels(10),
    },
    loadingFooter: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: scaledPixels(20),
      paddingHorizontal: scaledPixels(40),
    },
    loadingFooterText: {
      color: '#fff',
      fontSize: scaledPixels(16),
      marginLeft: scaledPixels(10),
      opacity: 0.8,
    },
  });
};
