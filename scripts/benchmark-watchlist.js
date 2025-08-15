#!/usr/bin/env node

/**
 * Benchmark script for testing watchlist performance with large datasets
 * Run with: node scripts/benchmark-watchlist.js
 */

const { performance } = require('perf_hooks');

// Simulate AsyncStorage operations
const mockAsyncStorage = {
  data: {},
  async getItem(key) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 10)); // Simulate async delay
    return this.data[key] || null;
  },
  async setItem(key, value) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 20)); // Simulate async delay
    this.data[key] = value;
  },
};

// Generate test data
function generateWatchlistItems(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    title: `Movie ${index}`,
    description: `Description for movie ${index}`,
    headerImage: `https://example.com/image${index}.jpg`,
    movie: `https://example.com/movie${index}.mp4`,
    duration: 90 + (index % 60),
    addedAt: Date.now() - index * 1000,
  }));
}

// Benchmark storage operations
async function benchmarkStorageOperations() {
  console.log('🚀 Starting Watchlist Storage Benchmark...\n');

  const testSizes = [100, 500, 1000, 2000];
  const results = [];

  for (const size of testSizes) {
    console.log(`📊 Testing with ${size} items...`);

    const items = generateWatchlistItems(size);
    const data = JSON.stringify({ version: 1, items });

    // Test write performance
    const writeStart = performance.now();
    await mockAsyncStorage.setItem('@watchlist_items', data);
    const writeTime = performance.now() - writeStart;

    // Test read performance
    const readStart = performance.now();
    const storedData = await mockAsyncStorage.getItem('@watchlist_items');
    const parsedData = JSON.parse(storedData);
    const readTime = performance.now() - readStart;

    // Test search performance (simulating isInWatchlist)
    const searchStart = performance.now();
    const searchId = Math.floor(size / 2); // Search for middle item
    const found = parsedData.items.some((item) => item.id === searchId);
    const searchTime = performance.now() - searchStart;

    // Test filter performance (simulating removeFromWatchlist)
    const filterStart = performance.now();
    const filtered = parsedData.items.filter((item) => item.id !== searchId);
    const filterTime = performance.now() - filterStart;

    const result = {
      size,
      writeTime: writeTime.toFixed(2),
      readTime: readTime.toFixed(2),
      searchTime: searchTime.toFixed(2),
      filterTime: filterTime.toFixed(2),
      dataSize: (data.length / 1024).toFixed(2), // KB
      found,
    };

    results.push(result);

    console.log(`  ✅ Write: ${result.writeTime}ms`);
    console.log(`  ✅ Read: ${result.readTime}ms`);
    console.log(`  ✅ Search: ${result.searchTime}ms`);
    console.log(`  ✅ Filter: ${result.filterTime}ms`);
    console.log(`  📦 Data size: ${result.dataSize}KB`);
    console.log('');
  }

  // Performance analysis
  console.log('📈 Performance Analysis:');
  console.log('========================');

  results.forEach((result) => {
    const efficiency = {
      writeEfficiency: (result.size / parseFloat(result.writeTime)).toFixed(0),
      readEfficiency: (result.size / parseFloat(result.readTime)).toFixed(0),
      searchEfficiency: (result.size / parseFloat(result.searchTime)).toFixed(0),
    };

    console.log(`${result.size} items:`);
    console.log(`  Write efficiency: ${efficiency.writeEfficiency} items/ms`);
    console.log(`  Read efficiency: ${efficiency.readEfficiency} items/ms`);
    console.log(`  Search efficiency: ${efficiency.searchEfficiency} items/ms`);
    console.log('');
  });

  // Performance recommendations
  console.log('💡 Performance Recommendations:');
  console.log('================================');

  const largestTest = results[results.length - 1];

  if (parseFloat(largestTest.writeTime) > 100) {
    console.log('⚠️  Write operations are slow with large datasets. Consider:');
    console.log('   - Implementing debounced writes');
    console.log('   - Using batch operations');
    console.log('   - Implementing data compression');
  }

  if (parseFloat(largestTest.readTime) > 50) {
    console.log('⚠️  Read operations are slow with large datasets. Consider:');
    console.log('   - Implementing lazy loading');
    console.log('   - Using pagination');
    console.log('   - Caching frequently accessed data');
  }

  if (parseFloat(largestTest.searchTime) > 10) {
    console.log('⚠️  Search operations are slow with large datasets. Consider:');
    console.log('   - Using Map or Set for O(1) lookups');
    console.log('   - Implementing indexing');
    console.log('   - Using binary search for sorted data');
  }

  if (parseFloat(largestTest.dataSize) > 1000) {
    // > 1MB
    console.log('⚠️  Data size is large. Consider:');
    console.log('   - Implementing data compression');
    console.log('   - Storing only essential data');
    console.log('   - Using external storage for large datasets');
  }

  console.log('\n✅ Benchmark completed successfully!');
}

// Benchmark React component rendering (simplified)
function benchmarkComponentPerformance() {
  console.log('\n🎨 Component Rendering Benchmark:');
  console.log('==================================');

  const testSizes = [50, 100, 200, 500];

  testSizes.forEach((size) => {
    const items = generateWatchlistItems(size);

    // Simulate component render time
    const renderStart = performance.now();

    // Simulate the work done during rendering
    items.forEach((item) => {
      // Simulate React.memo comparison
      const memoCheck = JSON.stringify(item);

      // Simulate style calculations
      const styles = {
        width: 300,
        height: 280,
        marginRight: 20,
        marginBottom: 20,
      };

      // Simulate focus state calculations
      const isFocused = Math.random() > 0.9;
      if (isFocused) {
        styles.borderWidth = 4;
        styles.borderColor = '#fff';
      }
    });

    const renderTime = performance.now() - renderStart;
    const itemsPerMs = (size / renderTime).toFixed(1);

    console.log(`${size} items: ${renderTime.toFixed(2)}ms (${itemsPerMs} items/ms)`);

    if (renderTime > 16) {
      // 60fps threshold
      console.log(`  ⚠️  Rendering may cause frame drops (>16ms)`);
    } else {
      console.log(`  ✅ Smooth rendering performance`);
    }
  });
}

// Run benchmarks
async function runBenchmarks() {
  try {
    await benchmarkStorageOperations();
    benchmarkComponentPerformance();
  } catch (error) {
    console.error('❌ Benchmark failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  runBenchmarks();
}

module.exports = {
  benchmarkStorageOperations,
  benchmarkComponentPerformance,
  generateWatchlistItems,
};
