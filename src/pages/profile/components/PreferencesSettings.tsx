import { CategoryPreferences } from './CategoryPreferences';
import { LocationPreferences } from './LocationPreferences';

export function PreferencesSettings() {
  return (
    <div className="space-y-6">
      <CategoryPreferences />
      <LocationPreferences />
    </div>
  );
}
