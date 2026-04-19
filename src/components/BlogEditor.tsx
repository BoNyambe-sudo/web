import { useState, useCallback, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadBlogImage, useDeleteBlogImage } from "@/hooks/serverState/useBlogServer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface BlogEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

const BlogEditor = ({
  initialContent = "",
  onChange,
  placeholder = "Start writing your blog...",
}: BlogEditorProps) => {
  const [imageUrl, setImageUrl] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const { mutate: uploadImage } = useUploadBlogImage();
  const { mutate: deleteImage } = useDeleteBlogImage();

  const handleOnChange = useCallback((html: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      if (onChange) {
        onChange(html);
      }
    }, 150);
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            rel: "noopener noreferrer",
            target: "_blank",
          },
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto cursor-pointer",
        },
      }),
      FileHandler.configure({
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              return false;
            }

            uploadImage(file, {
              onSuccess: (data) => {
                currentEditor
                  .chain()
                  .focus()
                  .setImage({ src: data.url })
                  .run();
              },
            });
          });
        },
        onDrop: (currentEditor, files) => {
          files.forEach((file) => {
            uploadImage(file, {
              onSuccess: (data) => {
                currentEditor
                  .chain()
                  .focus()
                  .setImage({ src: data.url })
                  .run();
              },
            });
          });
        },
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
      }),
    ],
    content: initialContent,
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      handleOnChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none",
      },
      handleClickOn: (view, pos, _event, _node) => {
        if (!editor) return false;
        const { state } = view;
        const attrs = state.doc.nodeAt(pos)?.attrs;
        if (attrs?.src) {
          setSelectedImageSrc(attrs.src);
        }
        return false;
      },
    },
  });

  const handleImageSubmit = useCallback(() => {
    if (imageUrl && editor) {
      uploadImage(imageUrl, {
        onSuccess: (data) => {
          editor.chain().focus().setImage({ src: data.url }).run();
        },
        onError: (error) => {
          console.error("Error uploading image:", error);
        },
      });
      setImageUrl(undefined);
      setImagePreview("");
      setShowImageInput(false);
    }
  }, [imageUrl, editor, uploadImage]);

  const handleRemoveImage = useCallback(() => {
    if (editor && selectedImageSrc) {
      const { state } = editor;
      const { doc } = state;
      
      let found = false;
      doc.descendants((node, pos) => {
        if (found) return;
        if (node.type.name === "image" && node.attrs.src === selectedImageSrc) {
          editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
          deleteImage(selectedImageSrc, {
            onError: (error) => {
              console.error("Error deleting image from Cloudinary:", error);
            },
          });
          setSelectedImageSrc(null);
          found = true;
        }
      });
    }
  }, [editor, selectedImageSrc, deleteImage]);

  const handleCancelImageSelection = useCallback(() => {
    setSelectedImageSrc(null);
  }, []);

  const handleLinkSubmit = useCallback(() => {
    if (!editor || !linkUrl) return;

    if (editor.isActive("link")) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setShowLinkDialog(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const addLink = useCallback(() => {
    if (!editor) return;
    setShowLinkDialog(true);
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b p-3 flex flex-wrap gap-2 bg-popover text-popover-foreground">
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "bg-primary/20 text-primary" : ""
          }
        >
          <Bold size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic") ? "bg-primary/20 text-primary" : ""
          }
        >
          <Italic size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive("underline") ? "bg-primary/20 text-primary" : ""
          }
        >
          <Underline size={16} />
        </Button>

        {/* Headings */}
        <div className="w-px bg-accent text-accent-foreground mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-primary/20 text-primary"
              : ""
          }
        >
          <Heading1 size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-primary/20 text-primary"
              : ""
          }
        >
          <Heading2 size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-primary/20 text-primary"
              : ""
          }
        >
          <Heading3 size={16} />
        </Button>

        {/* Lists */}
        <div className="w-px bg-accent text-accent-foreground mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "bg-primary/20 text-primary" : ""
          }
        >
          <List size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList") ? "bg-primary/20 text-primary" : ""
          }
        >
          <ListOrdered size={16} />
        </Button>

        {/* Block Elements */}
        <div className="w-px bg-accent text-accent-foreground mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote") ? "bg-primary/20 text-primary" : ""
          }
        >
          <Quote size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock") ? "bg-primary/20 text-primary" : ""
          }
        >
          <Code size={16} />
        </Button>

        {/* Links and Images */}
        <div className="w-px bg-accent text-accent-foreground mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={
            editor.isActive("link") ? "bg-primary/20 text-primary" : ""
          }
        >
          <Link size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImageInput(!showImageInput)}
          className={showImageInput ? "bg-primary/20 text-primary" : ""}
        >
          <ImageIcon size={16} />
        </Button>
        {selectedImageSrc && (
          <>
            <div className="w-px bg-accent text-accent-foreground mx-1" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancelImageSelection}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
          </>
        )}
      </div>

      {/* Image Input */}
      {showImageInput && (
        <div className="border-b p-3 bg-accent text-accent-foreground flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="file"
              placeholder="Image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageUrl(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleImageSubmit()}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-auto rounded border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl(undefined);
                    setImagePreview("");
                  }}
                  className="text-xs text-red-500 hover:text-red-700 mt-1"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <Button size="sm" onClick={handleImageSubmit} disabled={!imageUrl}>
            Add Image
          </Button>
        </div>
      )}

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="url"
              placeholder="Enter link URL (e.g. https://example.com)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLinkSubmit()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkSubmit} disabled={!linkUrl.trim()}>
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editor Content */}
      <div
        className={`p-6 min-h-100 relative ${isDragging ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-500" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const files = Array.from(e.dataTransfer.files);
          files.forEach((file) => {
            if (file.type.startsWith("image/")) {
              uploadImage(file, {
                onSuccess: (data) => {
                  editor.chain().focus().setImage({ src: data.url }).run();
                },
              });
            }
          });
        }}
      >
        <EditorContent editor={editor} />
        {!editor.getText().length && (
          <div className="absolute top-6.5 left-6 text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
