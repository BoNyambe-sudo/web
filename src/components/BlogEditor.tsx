import { useState, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadBlogImage } from "@/hooks/serverState/userBlogServer";
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
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const { mutate: uploadImage } = useUploadBlogImage();

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
      Image,
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
                  .insertContentAt(currentEditor.state.selection.anchor, {
                    type: "image",
                    attrs: {
                      src: data.url,
                    },
                  })
                  .focus()
                  .run();
              },
            });
          });
        },
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            uploadImage(file, {
              onSuccess: (data) => {
                currentEditor
                  .chain()
                  .insertContentAt(pos, {
                    type: "image",
                    attrs: {
                      src: data.url,
                    },
                  })
                  .focus()
                  .run();
              },
            });
          });
        },
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none",
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
      setShowImageInput(false);
    }
  }, [imageUrl, editor, uploadImage]);

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
        >
          <ImageIcon size={16} />
        </Button>
      </div>

      {/* Image Input */}
      {showImageInput && (
        <div className="border-b p-3 bg-accent text-accent-foreground flex gap-2">
          <Input
            type="file"
            placeholder="Image"
            value=""
            onChange={(e) => setImageUrl(e.target.files?.[0])}
            onKeyDown={(e) => e.key === "Enter" && handleImageSubmit()}
          />
          <Button size="sm" onClick={handleImageSubmit}>
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
      <div className="p-6 min-h-100 relative">
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
