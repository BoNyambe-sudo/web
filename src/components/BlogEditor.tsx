import { useState, useCallback, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
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
  ArrowUp,
  Table as TableIcon,
  Columns,
  Rows,
  Heading,
  Combine,
  Split,
  Wrench,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  useUploadBlogImage,
  useDeleteBlogImage,
} from "@/hooks/serverState/useBlogServer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ExtendedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
    };
  },
});

interface BlogEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

const BlogEditor = ({
  initialContent = "",
  onChange,
  placeholder = "Start writing your blog...",
  scrollContainerRef,
}: BlogEditorProps) => {
  const [imageUrl, setImageUrl] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageAltText, setImageAltText] = useState<string>("");
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const { mutate: uploadImage } = useUploadBlogImage();
  const { mutate: deleteImage } = useDeleteBlogImage();

  useEffect(() => {
    const target = scrollContainerRef?.current;
    if (target) {
      const handleScroll = () => {
        setShowBackToTop(target.scrollTop > 300);
      };
      target.addEventListener("scroll", handleScroll);
      return () => target.removeEventListener("scroll", handleScroll);
    }
  }, [scrollContainerRef]);

  const handleOnChange = useCallback(
    (html: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        if (onChange) {
          onChange(html);
        }
      }, 150);
    },
    [onChange],
  );

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
      ExtendedImage.configure({
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
                  .setImage({ src: data.url, alt: file.name })
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
                  .setImage({ src: data.url, alt: file.name })
                  .run();
              },
            });
          });
        },
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
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
      handleClickOn: (view, pos) => {
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
          editor
            .chain()
            .focus()
            .setImage({ src: data.url, alt: imageAltText || imageUrl.name })
            .run();
        },
        onError: (error) => {
          console.error("Error uploading image:", error);
        },
      });
      setImageUrl(undefined);
      setImagePreview("");
      setImageAltText("");
      setShowImageInput(false);
    }
  }, [imageUrl, editor, uploadImage, imageAltText]);

  const handleRemoveImage = useCallback(() => {
    if (editor && selectedImageSrc) {
      const { state } = editor;
      const { doc } = state;

      let found = false;
      doc.descendants((node, pos) => {
        if (found) return;
        if (node.type.name === "image" && node.attrs.src === selectedImageSrc) {
          editor
            .chain()
            .focus()
            .deleteRange({ from: pos, to: pos + node.nodeSize })
            .run();
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
    <div className="relative border rounded-lg overflow-hidden">
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
          aria-label="Bold"
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
          aria-label="Italic"
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
          aria-label="Underline"
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
          aria-label="Heading 1"
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
          aria-label="Heading 2"
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
          aria-label="Heading 3"
        >
          <Heading3 size={16} />
        </Button>

        {/* Alignment */}
        <div className="w-px bg-accent text-accent-foreground mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" }) ? "bg-primary/20 text-primary" : ""
          }
          aria-label="Align left"
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "bg-primary/20 text-primary" : ""
          }
          aria-label="Align center"
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" }) ? "bg-primary/20 text-primary" : ""
          }
          aria-label="Align right"
        >
          <AlignRight size={16} />
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
          aria-label="Bullet list"
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
          aria-label="Ordered list"
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
          aria-label="Blockquote"
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
          aria-label="Code block"
        >
          <Code size={16} />
        </Button>

        {/* Tables */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={
                editor.isActive("table") ? "bg-primary/20 text-primary" : ""
              }
              aria-label="Table"
            >
              <TableIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                }
              >
                <TableIcon size={14} />
                Insert Table
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {editor.isActive("table") && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Columns</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                    <Columns size={14} />
                    Add Column Before
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                    <Columns size={14} />
                    Add Column After
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
                    <Trash2 size={14} />
                    Delete Column
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Rows</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                    <Rows size={14} />
                    Add Row Before
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                    <Rows size={14} />
                    Add Row After
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
                    <Trash2 size={14} />
                    Delete Row
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Header</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
                    <Heading size={14} />
                    Toggle Header Row
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
                    <Heading size={14} />
                    Toggle Header Column
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Cell</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>
                    <Combine size={14} />
                    Merge Cells
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>
                    <Split size={14} />
                    Split Cell
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
                    <Heading size={14} />
                    Toggle Header Cell
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => editor.chain().focus().fixTables().run()}>
                  <Wrench size={14} />
                  Fix Table
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>
                  <Trash2 size={14} />
                  Delete Table
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

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
          aria-label="Insert link"
        >
          <Link size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImageInput(!showImageInput)}
          className={showImageInput ? "bg-primary/20 text-primary" : ""}
          aria-label="Insert image"
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
              className="text-destructive hover:text-red-700 hover:bg-red-50"
              aria-label="Remove selected image"
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
        <div className="border-b p-3 bg-accent text-accent-foreground flex gap-2 flex-col">
          <div className="flex gap-2 w-full">
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
          <div className="w-full">
            <label className="text-xs text-muted-foreground mb-1 block">
              Alt Text (optional)
            </label>
            <Input
              type="text"
              placeholder="Describe the image for accessibility"
              value={imageAltText}
              onChange={(e) => setImageAltText(e.target.value)}
              className="bg-background"
              disabled={!imageUrl}
            />
          </div>
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
              aria-label="Link URL"
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
                  editor
                    .chain()
                    .focus()
                    .setImage({ src: data.url, alt: file.name })
                    .run();
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
      {showBackToTop && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4"
          onClick={() => {
            if (scrollContainerRef?.current) {
              scrollContainerRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          aria-label="Back to top"
        >
          <ArrowUp />
        </Button>
      )}
    </div>
  );
};

export default BlogEditor;
