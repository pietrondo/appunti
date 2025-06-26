import test from 'node:test';
import assert from 'node:assert';
import BackupManager from '../js/backup.js';

class MockConfigManager {
  constructor(interval, max) {
    this.interval = interval;
    this.max = max;
  }
  get(path, def) {
    if (path === 'storage.backupInterval') return this.interval;
    if (path === 'storage.maxBackups') return this.max;
    return def;
  }
}

class SilentBackupManager extends BackupManager {
  init() { /* override to prevent timers */ }
}

test('BackupManager uses config values', () => {
  global.logger = { info() {}, debug() {}, error() {} };
  global.localStorage = {
    getItem() { return null; },
    setItem() {},
    removeItem() {},
    key() { return null; },
    length: 0
  };
  const cfg = new MockConfigManager(123456, 7);
  const manager = new SilentBackupManager(cfg);
  assert.strictEqual(manager.autoBackupInterval, 123456);
  assert.strictEqual(manager.maxBackups, 7);
});
