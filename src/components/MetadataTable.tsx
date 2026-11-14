import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { ExifTagItem, TagCategory, detectAiSignature } from '../utils/exifEngine';
import { Translations } from '../utils/i18n';

export type ActiveTab = 'all' | 'ai' | 'camera' | 'diff';

interface MetadataTableProps {
  t: Translations;
  originalTags: ExifTagItem[];
  currentTags: ExifTagItem[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onUpdateTag: (id: string, newKey: string, newValue: string) => void;
  onDeleteTag: (id: string) => void;
  onAddTag: (key: string, value: string, category: TagCategory) => void;
}

export const MetadataTable: React.FC<MetadataTableProps> = ({
  t,
  originalTags,
  currentTags,
  activeTab,
  setActiveTab,
  onUpdateTag,
  onDeleteTag,
  onAddTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');

  // Inline new tag row state
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newCategory, setNewCategory] = useState<TagCategory>('camera');
  const [newValue, setNewValue] = useState('');
  const [addError, setAddError] = useState(false);

  const aiCount = currentTags.filter((tag) => tag.isAiTrace || tag.category === 'ai').length;
  const cameraCount = currentTags.filter((tag) => tag.category !== 'ai' && !tag.isAiTrace).length;

  const getCategoryLabel = (cat: TagCategory): string => {
    switch (cat) {
      case 'ai':
        return t.catAi;
      case 'camera':
        return t.catCamera;
      case 'date':
        return t.catDate;
      case 'location':
        return t.catLocation;
      case 'file':
        return t.catFile;
      default:
        return t.catCustom;
    }
  };

  const filteredTags = currentTags.filter((item) => {
    if (activeTab === 'ai' && !item.isAiTrace && item.category !== 'ai') return false;
    if (activeTab === 'camera' && (item.isAiTrace || item.category === 'ai')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.key.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        item.sourceSegment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStartEdit = (item: ExifTagItem) => {
    setEditingId(item.id);
    setEditKey(item.key);
    setEditValue(item.value);
  };

  const handleSaveEdit = (id: string) => {
    if (!editKey.trim()) return;
    onUpdateTag(id, editKey.trim(), editValue.trim());
    setEditingId(null);
  };

  const handleConfirmAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) {
      setAddError(true);
      return;
    }
    onAddTag(newKey.trim(), newValue.trim(), newCategory);
    setNewKey('');
    setNewValue('');
    setAddError(false);
    setIsAdding(false);
  };

  // Compute diff rows for Before / After view
  const renderDiffView = () => {
    const allKeys = new Set<string>();
    const origMap = new Map<string, ExifTagItem>();
    const currMap = new Map<string, ExifTagItem>();

    originalTags.forEach((tag) => {
      allKeys.add(tag.key);
      origMap.set(tag.key, tag);
    });
    currentTags.forEach((tag) => {
      allKeys.add(tag.key);
      currMap.set(tag.key, tag);
    });

    const rows = Array.from(allKeys).map((key) => {
      const orig = origMap.get(key);
      const curr = currMap.get(key);
      let status: 'removed' | 'added' | 'modified' | 'kept' = 'kept';
      if (orig && !curr) status = 'removed';
      else if (!orig && curr) status = 'added';
      else if (orig && curr && orig.value !== curr.value) status = 'modified';
      return { key, orig, curr, status };
    });

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D8E6F3] text-xs font-semibold text-[#4A6B88]">
              <th className="py-3 px-4 w-44">{t.colTagKey}</th>
              <th className="py-3 px-4">{t.diffBefore}</th>
              <th className="py-3 px-4">{t.diffAfter}</th>
              <th className="py-3 px-4 w-32 text-right">{t.colStatus}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EFF8] text-xs">
            {rows.map(({ key, orig, curr, status }) => (
              <tr key={key} className="hover:bg-[#F8FBFE] transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-[#0F2537] align-top">
                  {key}
                </td>
                <td className="py-3 px-4 font-mono text-[#4A6B88] break-all align-top max-w-[260px]">
                  {orig ? orig.value : '—'}
                </td>
                <td className="py-3 px-4 font-mono text-[#0F2537] break-all align-top max-w-[260px]">
                  {curr ? curr.value : '—'}
                </td>
                <td className="py-3 px-4 text-right align-top font-medium whitespace-nowrap">
                  {status === 'removed' && (
                    <span className="text-rose-700">{t.diffRemoved}</span>
                  )}
                  {status === 'modified' && (
                    <span className="text-sky-700">{t.diffModified}</span>
                  )}
                  {status === 'added' && (
                    <span className="text-emerald-700">{t.diffAdded}</span>
                  )}
                  {status === 'kept' && (
                    <span className="text-[#4A6B88]">{t.diffKept}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#D8E6F3] rounded-xl overflow-hidden">
      {/* Segmented Filter Tabs & Add Button Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-[#D8E6F3] bg-[#F9FCFF]">
        <div
          role="tablist"
          aria-label="Metadata Filter Tabs"
          className="flex items-center gap-1 p-1 bg-[#E6F0F9] rounded-lg overflow-x-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#0F2537] shadow-xs'
                : 'text-[#4A6B88] hover:text-[#0F2537]'
            }`}
          >
            {t.tabAllTags} ({currentTags.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ai'}
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-white text-[#0F2537] shadow-xs'
                : 'text-[#4A6B88] hover:text-[#0F2537]'
            }`}
          >
            {t.tabAiTraces} ({aiCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'camera'}
            onClick={() => setActiveTab('camera')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-[#0F2537] shadow-xs'
                : 'text-[#4A6B88] hover:text-[#0F2537]'
            }`}
          >
            {t.tabCameraExif} ({cameraCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'diff'}
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'diff'
                ? 'bg-white text-[#0F2537] shadow-xs'
                : 'text-[#4A6B88] hover:text-[#0F2537]'
            }`}
          >
            {t.tabDiffView}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveTab('all');
            setIsAdding((prev) => !prev);
            setAddError(false);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.addCustomTagBtn}
        </button>
      </div>

      {/* Add New Custom Tag Inline Form */}
      {isAdding && (
        <form
          onSubmit={handleConfirmAdd}
          className="p-5 bg-[#F2F8FD] border-b border-[#D8E6F3]"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[#0F2537]">{t.modalAddTitle}</h4>
            <button
              type="button"
              aria-label={t.cancelBtn}
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#4A6B88] hover:text-[#0F2537] cursor-pointer"
            >
              {t.cancelBtn}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4">
              <label
                htmlFor="new-tag-key"
                className="block text-xs font-medium text-[#4A6B88] mb-1"
              >
                {t.modalTagKeyLabel}
              </label>
              <input
                id="new-tag-key"
                type="text"
                value={newKey}
                onChange={(e) => {
                  setNewKey(e.target.value);
                  setAddError(false);
                }}
                placeholder="Artist, Copyright, LensModel..."
                className={`w-full px-3 py-2 text-xs font-mono bg-white border rounded-lg text-[#0F2537] focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  addError && !newKey.trim() ? 'border-rose-500' : 'border-[#C5D9EC]'
                }`}
              />
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="new-tag-category"
                className="block text-xs font-medium text-[#4A6B88] mb-1"
              >
                {t.modalTagCategoryLabel}
              </label>
              <select
                id="new-tag-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TagCategory)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#C5D9EC] rounded-lg text-[#0F2537] focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="camera">{t.catCamera}</option>
                <option value="date">{t.catDate}</option>
                <option value="location">{t.catLocation}</option>
                <option value="file">{t.catFile}</option>
                <option value="custom">{t.catCustom}</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="new-tag-value"
                className="block text-xs font-medium text-[#4A6B88] mb-1"
              >
                {t.modalTagValueLabel}
              </label>
              <input
                id="new-tag-value"
                type="text"
                value={newValue}
                onChange={(e) => {
                  setNewValue(e.target.value);
                  setAddError(false);
                }}
                placeholder="Canon EOS R5, Studio 2026..."
                className={`w-full px-3 py-2 text-xs font-mono bg-white border rounded-lg text-[#0F2537] focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  addError && !newValue.trim() ? 'border-rose-500' : 'border-[#C5D9EC]'
                }`}
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full px-3 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.modalConfirmAdd}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search Bar (only on non-diff tabs) */}
      {activeTab !== 'diff' && (
        <div className="px-5 py-3 border-b border-[#D8E6F3] bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-[#4A6B88] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              aria-label={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F4F8FB] border border-[#D8E6F3] rounded-lg text-[#0F2537] placeholder-[#6B8BA6] focus:outline-none focus:bg-white focus:border-sky-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Table Body or Diff View */}
      {activeTab === 'diff' ? (
        renderDiffView()
      ) : filteredTags.length === 0 ? (
        <div className="py-14 px-6 text-center">
          <ShieldCheck className="w-8 h-8 text-sky-600 mx-auto mb-2.5 opacity-80" />
          <p className="text-sm font-semibold text-[#0F2537] mb-1">
            {t.emptyTagsTitle}
          </p>
          <p className="text-xs text-[#4A6B88] max-w-md mx-auto">
            {t.emptyTagsDesc}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D8E6F3] text-xs font-semibold text-[#4A6B88] bg-[#FBFDFF]">
                <th className="py-3 px-4 w-48">{t.colTagKey}</th>
                <th className="py-3 px-4 w-40">{t.colCategory}</th>
                <th className="py-3 px-4">{t.colValue}</th>
                <th className="py-3 px-4 w-32">{t.colStatus}</th>
                <th className="py-3 px-4 w-28 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EFF8] text-xs">
              {filteredTags.map((item) => {
                const isEditing = editingId === item.id;
                const liveAiCheck = isEditing
                  ? detectAiSignature(editKey, editValue, item.sourceSegment)
                  : { isAi: item.isAiTrace };

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      item.isAiTrace
                        ? 'bg-amber-50/35 hover:bg-amber-50/60'
                        : 'hover:bg-[#F8FBFE]'
                    }`}
                  >
                    {/* Key Column */}
                    <td className="py-3 px-4 align-top font-mono font-medium text-[#0F2537]">
                      {isEditing ? (
                        <input
                          type="text"
                          aria-label={`${t.colTagKey} ${item.key}`}
                          value={editKey}
                          onChange={(e) => setEditKey(e.target.value)}
                          className="w-full px-2 py-1 text-xs font-mono bg-white border border-sky-500 rounded text-[#0F2537]"
                        />
                      ) : (
                        <div>
                          <span>{item.key}</span>
                          <div className="text-[11px] font-sans font-normal text-[#5C7C99] mt-0.5">
                            {item.sourceSegment}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Category Column (Unboxed clean metadata text) */}
                    <td className="py-3 px-4 align-top text-[#4A6B88] whitespace-nowrap">
                      {getCategoryLabel(item.category)}
                    </td>

                    {/* Value Column */}
                    <td className="py-3 px-4 align-top font-mono text-[#0F2537] break-words max-w-[360px]">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          aria-label={`${t.colValue} ${item.key}`}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-sky-500 rounded text-[#0F2537]"
                        />
                      ) : (
                        <span className="leading-relaxed">{item.value}</span>
                      )}
                    </td>

                    {/* Status Column (Paired icon + text, no pill enclosure) */}
                    <td className="py-3 px-4 align-top whitespace-nowrap">
                      {liveAiCheck.isAi ? (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.flagAiTrace}</span>
                        </span>
                      ) : item.isModified ? (
                        <span className="text-sky-700 font-medium">
                          {t.flagModified}
                        </span>
                      ) : (
                        <span className="text-[#4A6B88]">{t.flagStandard}</span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            aria-label={`${t.saveBtn} ${item.key}`}
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title={t.saveBtn}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`${t.cancelBtn} ${item.key}`}
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-[#4A6B88] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title={t.cancelBtn}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            aria-label={`${t.editBtn} ${item.key}`}
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 text-[#4A6B88] hover:text-sky-700 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                            title={`${t.editBtn} ${item.key}`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`${t.deleteTagBtn} ${item.key}`}
                            onClick={() => onDeleteTag(item.id)}
                            className="p-1.5 text-[#4A6B88] hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title={`${t.deleteTagBtn} ${item.key}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
