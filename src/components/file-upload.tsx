'use client'

import { useCallback, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  accept?: string
  maxSize?: number
  multiple?: boolean
  className?: string
  onUpload?: (files: File[]) => Promise<void>
  onError?: (error: string) => void
}

export function FileUpload({
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  multiple = false,
  className,
  onUpload,
  onError,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length) return
      const files = Array.from(fileList)

      const oversized = files.find((f) => f.size > maxSize)
      if (oversized) {
        onError?.(`File "${oversized.name}" exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`)
        return
      }

      setUploading(true)
      setProgress(0)
      try {
        const interval = setInterval(() => {
          setProgress((p) => Math.min(p + 10, 90))
        }, 100)
        await onUpload?.(files)
        clearInterval(interval)
        setProgress(100)
      } catch {
        onError?.('Upload failed')
      } finally {
        setTimeout(() => {
          setUploading(false)
          setProgress(0)
        }, 500)
      }
    },
    [maxSize, onUpload, onError],
  )

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <svg
        className="text-muted-foreground mb-3 h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
      <p className="mb-1 text-sm font-medium">Drag & drop or click to upload</p>
      <p className="text-muted-foreground text-xs">Max {Math.round(maxSize / 1024 / 1024)}MB</p>
      {uploading && <Progress value={progress} className="mt-3 w-full max-w-xs" />}
      {!uploading && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
        >
          Choose file
        </Button>
      )}
    </div>
  )
}
