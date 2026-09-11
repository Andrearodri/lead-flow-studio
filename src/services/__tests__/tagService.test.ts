import { describe, it, expect, beforeEach } from 'vitest';
import { tagService } from '../tagService';

describe('tagService', () => {
  it('returns initial tag list snapshot', () => {
    const tags = tagService.getTags();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
    expect(tags.some((t) => t.name === 'VIP')).toBe(true);
  });

  it('adds a new tag dynamically and notifies subscribers', () => {
    const initialCount = tagService.getTags().length;

    const createdTag = tagService.addTag('Alta Prioridade', 'bg-rose-500', 'text-white');
    expect(createdTag.name).toBe('Alta Prioridade');
    expect(tagService.getTags().length).toBe(initialCount + 1);
  });

  it('deletes tag by id', () => {
    const tag = tagService.addTag('Remover Tag', 'bg-slate-500', 'text-white');
    expect(tagService.getById(tag.id)).toBeDefined();

    tagService.deleteTag(tag.id);
    expect(tagService.getById(tag.id)).toBeUndefined();
  });
});
