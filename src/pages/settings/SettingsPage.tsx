import { useState } from "react";
import { Loader2, Trash2, Check, X, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  useTags,
  useUpdateTag,
  useDeleteTag,
  useCreateTag,
} from "@/hooks/useSites";
import { PRESET_COLORS, ROUTES } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

// ─── Tag row (inline edit) ────────────────────────────────────────────────────

interface TagRowProps {
  tag: { id: string; name: string; color: string };
}

function TagRow({ tag }: TagRowProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);

  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const isDirty = name !== tag.name || color !== tag.color;

  const handleSave = () => {
    if (!name.trim()) return;
    updateTag.mutate(
      { tagId: tag.id, data: { name: name.trim(), color } },
      { onSuccess: () => setEditing(false) },
    );
  };

  const handleCancel = () => {
    setName(tag.name);
    setColor(tag.color);
    setEditing(false);
  };

  const handleDelete = () => {
    if (!confirm(`Delete tag "${tag.name}"?`)) return;
    deleteTag.mutate(tag.id);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-(--bg-secondary)">
      {/* Color swatch */}
      <button
        onClick={() => setEditing(true)}
        className="w-5 h-5 rounded-full shrink-0 transition-transform hover:scale-110 outline-offset-2"
        style={{
          background: color,
          outline: editing ? `2px solid ${color}` : "none",
        }}
        title="Change color"
      />

      {/* Name */}
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          className="flex-1 px-2.5 py-1 text-sm rounded-lg outline-none bg-(--bg) border border-(--border) text-(--fg)"
        />
      ) : (
        <span
          className="flex-1 text-sm text-(--fg) cursor-pointer"
          onClick={() => setEditing(true)}
        >
          {tag.name}
        </span>
      )}

      {/* Color picker (editing only) */}
      {editing && (
        <div className="flex gap-1.5 shrink-0">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-4 h-4 rounded-full transition-transform hover:scale-110 outline-offset-2"
              style={{
                background: c,
                outline: color === c ? `2px solid ${c}` : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {editing && isDirty && (
          <>
            <button
              onClick={handleSave}
              disabled={updateTag.isPending}
              className="p-1.5 rounded-lg hover:bg-(--bg) transition-colors text-green-500"
              title="Save"
            >
              {updateTag.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg hover:bg-(--bg) transition-colors text-(--fg-secondary)"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </>
        )}
        {!editing && (
          <button
            onClick={handleDelete}
            disabled={deleteTag.isPending}
            className="p-1.5 rounded-lg hover:bg-(--bg) transition-colors opacity-40 hover:opacity-100 text-(--fg-secondary)"
            title="Delete tag"
          >
            {deleteTag.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── New tag form ─────────────────────────────────────────────────────────────

function NewTagForm() {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const createTag = useCreateTag();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createTag.mutate(
      { name: name.trim(), color },
      {
        onSuccess: () => {
          setName("");
          setColor(PRESET_COLORS[0]);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-(--bg-secondary)"
    >
      {/* Color picker */}
      <div className="flex gap-1.5 shrink-0">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className="w-4 h-4 rounded-full transition-transform hover:scale-110 outline-offset-2"
            style={{
              background: c,
              outline: color === c ? `2px solid ${c}` : "none",
            }}
          />
        ))}
      </div>

      {/* Name input */}
      <input
        type="text"
        placeholder="New tag name…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-2.5 py-1 text-sm rounded-lg outline-none bg-(--bg) border border-(--border) text-(--fg)"
      />

      <button
        type="submit"
        disabled={!name.trim() || createTag.isPending}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 disabled:opacity-40 bg-(--color-primary) text-white"
      >
        {createTag.isPending ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          "Add"
        )}
      </button>
    </form>
  );
}

// ─── Settings page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, logout, token } = useAuthStore();
  const { data: tags = [], isLoading } = useTags();

  const navigate = useNavigate();

  if (!token) {
    navigate(ROUTES.dashboard);
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-2xl font-bold text-(--fg)">Settings</h1>

      {/* ── Tags ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-(--fg)">Tags</h2>
          <p className="text-sm mt-0.5 text-(--fg-tertiary)">
            Manage tags used to categorise your sites.
          </p>
        </div>

        <div className="space-y-2">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2
                size={20}
                className="animate-spin text-(--fg-tertiary)"
              />
            </div>
          )}
          {!isLoading && tags.length === 0 && (
            <p className="text-sm py-4 text-center text-(--fg-tertiary)">
              No tags yet — create your first one below.
            </p>
          )}
          {tags.map((tag) => (
            <TagRow key={tag.id} tag={tag} />
          ))}
          <NewTagForm />
        </div>
      </section>

      {/* ── Account ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-(--fg)">Account</h2>
          <p className="text-sm mt-0.5 text-(--fg-tertiary)">
            Your session info.
          </p>
        </div>

        <div className="rounded-xl px-4 py-4 space-y-3 bg-(--bg-secondary)">
          {user?.email && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-(--fg-secondary)">Email</span>
              <span className="text-sm font-medium text-(--fg)">
                {user.email}
              </span>
            </div>
          )}
          {user?.name && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-(--fg-secondary)">Name</span>
              <span className="text-sm font-medium text-(--fg)">
                {user.name}
              </span>
            </div>
          )}
          <div className="pt-2 border-t border-(--border)">
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
