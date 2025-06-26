import test from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const StorageManager = require('../js/storage.js');

class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() { this.store = {}; }
  getItem(key) { return this.store.hasOwnProperty(key) ? this.store[key] : null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
  key(index) { return Object.keys(this.store)[index] || null; }
  get length() { return Object.keys(this.store).length; }
}

test('StorageManager saves and retrieves events', () => {
  global.localStorage = new LocalStorageMock();
  const manager = new StorageManager();
  const evt = { title: 'Evento', date: '2024-01-01', period: 'modern', description: '', importance: 'medium' };
  manager.addEvent(evt);
  const saved = manager.getAllEvents()[0];
  assert.strictEqual(saved.title, 'Evento');
  manager.deleteEvent(saved.id);
});

test('StorageManager saves and retrieves people', () => {
  global.localStorage = new LocalStorageMock();
  const manager = new StorageManager();
  const person = { name: 'Persona', birth: '1900-01-01', death: '2000-01-01', role: 'Role', period: 'modern' };
  manager.addPerson(person);
  const saved = manager.getAllPeople()[0];
  assert.strictEqual(saved.name, 'Persona');
  manager.deletePerson(saved.id);
});
