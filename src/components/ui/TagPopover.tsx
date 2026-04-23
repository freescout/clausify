import { useState, useRef, useEffect } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  useTags,
  useCreateTag,
  useAssignTag,
  useRemoveTag,
} from "@/hooks/useSites";
import type { Tag, SiteListItem } from "@/types";
import { PRESET_COLORS } from "@/lib/constants";

interface Props {
  site: SiteListItem;
}

export default function TagPopover({ site }: Props) {
  const { token, openLoginModal } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const ref = useRef<HTMLDivElement>(null);

  const { data: allTags = [] } = useTags();
  const createTag = useCreateTag();
  const assignTag = useAssignTag();
  const removeTag = useRemoveTag();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card navigation
    if (!token) {
      openLoginModal();
      return;
    }
    setOpen((o) => !o);
  };

  const isAssigned = (tag: Tag) => site.tags.some((t) => t.id === tag.id);

  const handleToggleTag = (tag: Tag) => {
    if (isAssigned(tag)) {
      removeTag.mutate({ tagId: tag.id, siteId: site.id });
    } else {
      assignTag.mutate({ tagId: tag.id, siteId: site.id });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const tag = await createTag.mutateAsync({
      name: newName.trim(),
      color: newColor,
    });
    assignTag.mutate({ tagId: tag.id, siteId: site.id });
    setNewName("");
    setNewColor(PRESET_COLORS[0]);
    setCreating(false);
  };

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Trigger — replaces the "No tags" text */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-1 flex-wrap"
      >
        {site.tags.length > 0 ? (
          site.tags.map((t) => (
            <span
              key={t.id}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: t.color + "22", color: t.color }}
            >
              {t.name}
            </span>
          ))
        ) : (
          <span className="text-xs text-(--fg-tertiary) hover:text-(--fg) transition-colors">
            + Add tag
          </span>
        )}
      </button>

      {/* Popover */}
      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 w-56 rounded-xl shadow-lg z-40 p-3 space-y-2"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Existing tags */}
          <div className="space-y-0.5">
            {allTags.length === 0 && !creating && (
              <p className="text-xs text-(--fg-tertiary) py-1">
                No tags yet. Create one below.
              </p>
            )}
            {allTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleToggleTag(tag)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-(--bg-secondary) transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: tag.color }}
                  />
                  <span className="text-sm text-(--fg)">{tag.name}</span>
                </div>
                {isAssigned(tag) && (
                  <Check size={13} className="text-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Create new tag */}
          {creating ? (
            <form
              onSubmit={handleCreate}
              className="space-y-2 pt-1 border-t border-(--border)"
            >
              <input
                autoFocus
                type="text"
                placeholder="Tag name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-sm rounded-lg outline-none"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--fg)",
                }}
              />
              {/* Color picker */}
              <div className="flex gap-1.5 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className="w-5 h-5 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: c,
                      outline: newColor === c ? `2px solid ${c}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-1.5">
                <button
                  type="submit"
                  disabled={createTag.isPending}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                  style={{ background: "var(--color-primary)", color: "white" }}
                >
                  {createTag.isPending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-2.5 py-1.5 text-xs rounded-lg"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-(--fg-secondary) hover:text-(--fg) hover:bg-(--bg-secondary) rounded-lg transition-colors border-t border-(--border) pt-2 mt-1"
            >
              <Plus size={12} />
              New tag
            </button>
          )}
        </div>
      )}
    </div>
  );
}
