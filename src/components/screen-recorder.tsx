"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CloudStorage from "@/components/cloud-storage";
import {
  Video,
  Square,
  Pause,
  Play,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Settings,
  Download,
  Upload,
  Trash2,
  Move,
  Palette,
  Circle,
  Eraser,
  RotateCcw,
  Square as RectangleIcon,
  ArrowRight,
  Minus,
  Type,
  Eye,
  EyeOff,
  Undo2,
  Redo2,
  MousePointer2,
  Highlighter,
  Save,
  Minimize2,
  Maximize2,
  GripVertical,
  Monitor,
  Layers,
} from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface Recording {
  id: string;
  blob: Blob;
  timestamp: Date;
  duration: number;
}

interface DrawingPoint {
  x: number;
  y: number;
  color: string;
  size: number;
}

interface DrawingStroke {
  points: DrawingPoint[];
  color: string;
  size: number;
  tool: DrawingTool;
  id: string;
}

interface DrawingShape {
  id: string;
  type: "rectangle" | "circle" | "arrow" | "line";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  size: number;
}

interface DrawingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  font: string;
}

type DrawingTool =
  | "pen"
  | "highlighter"
  | "eraser"
  | "rectangle"
  | "circle"
  | "arrow"
  | "line"
  | "text";

export default function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [cameraPosition, setCameraPosition] = useState<Position>({
    x: 20,
    y: 20,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#ff0000");
  const [drawingSize, setDrawingSize] = useState(3);
  const [drawingStrokes, setDrawingStrokes] = useState<DrawingStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawingPoint[]>([]);
  const [drawingTool, setDrawingTool] = useState<DrawingTool>("pen");
  const [drawingShapes, setDrawingShapes] = useState<DrawingShape[]>([]);
  const [drawingTexts, setDrawingTexts] = useState<DrawingText[]>([]);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [isShapeDrawing, setIsShapeDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<DrawingShape | null>(null);
  const [showDrawingPanel, setShowDrawingPanel] = useState(false);
  const [isControlsMinimized, setIsControlsMinimized] = useState(false);
  const [controlsPosition, setControlsPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [isDraggingControls, setIsDraggingControls] = useState(false);
  const [controlsDragOffset, setControlsDragOffset] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [isClient, setIsClient] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null
  );
  const [showStorageModal, setShowStorageModal] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<HTMLVideoElement | null>(null);

  // Initialize camera preview
  const setupCameraPreview = useCallback(async () => {
    if (!showCameraPreview) return;

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 200, height: 200 },
        audio: false,
      });
      cameraStreamRef.current = cameraStream;

      if (cameraRef.current) {
        cameraRef.current.srcObject = cameraStream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      setShowCameraPreview(false);
    }
  }, [showCameraPreview]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setupCameraPreview();

    return () => {
      if (cameraStreamRef.current && !isRecording) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setupCameraPreview, isRecording]);

  // Initialize drawing canvas
  useEffect(() => {
    if (drawingCanvasRef.current && (isRecording || showDrawingPanel)) {
      const canvas = drawingCanvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [isRecording, isDrawing, showDrawingPanel]);

  // Handle drawing
  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !drawingCanvasRef.current) return;

      // Prevent drawing when clicking on UI elements
      if (e.target !== drawingCanvasRef.current) return;

      const rect = drawingCanvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (["rectangle", "circle", "arrow", "line"].includes(drawingTool)) {
        // Shape drawing
        setIsShapeDrawing(true);
        const shape: DrawingShape = {
          id: Date.now().toString(),
          type: drawingTool as any,
          startX: x,
          startY: y,
          endX: x,
          endY: y,
          color: drawingColor,
          size: drawingSize,
        };
        setCurrentShape(shape);
      } else if (drawingTool === "text") {
        // Text tool
        const text = prompt("Enter text:");
        if (text) {
          const newText: DrawingText = {
            id: Date.now().toString(),
            x,
            y,
            text,
            color: drawingColor,
            size: drawingSize * 4,
            font: "Arial",
          };
          setDrawingTexts((prev) => [...prev, newText]);
          saveToUndoStack();
        }
      } else {
        // Pen, highlighter, eraser
        setIsDrawingActive(true);
        const point: DrawingPoint = {
          x,
          y,
          color: drawingTool === "eraser" ? "#FFFFFF" : drawingColor,
          size: drawingTool === "highlighter" ? drawingSize * 2 : drawingSize,
        };
        setCurrentStroke([point]);
      }
    },
    [isDrawing, drawingColor, drawingSize, drawingTool]
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!drawingCanvasRef.current) return;

      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (ctx) {
        if (isShapeDrawing && currentShape) {
          // Update shape end position
          setCurrentShape((prev) =>
            prev ? { ...prev, endX: x, endY: y } : null
          );

          // Redraw canvas with current shape
          redrawCanvas();
          drawShape(ctx, { ...currentShape, endX: x, endY: y });
        } else if (isDrawingActive) {
          // Continue drawing stroke
          const point: DrawingPoint = {
            x,
            y,
            color: drawingTool === "eraser" ? "#FFFFFF" : drawingColor,
            size: drawingTool === "highlighter" ? drawingSize * 2 : drawingSize,
          };

          setCurrentStroke((prev) => {
            const newStroke = [...prev, point];

            // Draw the line segment
            if (newStroke.length > 1) {
              const prevPoint = newStroke[newStroke.length - 2];
              ctx.beginPath();
              ctx.moveTo(prevPoint.x, prevPoint.y);
              ctx.lineTo(point.x, point.y);
              ctx.strokeStyle = point.color;
              ctx.lineWidth = point.size;
              ctx.globalCompositeOperation =
                drawingTool === "eraser"
                  ? "destination-out"
                  : drawingTool === "highlighter"
                    ? "multiply"
                    : "source-over";
              ctx.stroke();
              ctx.globalCompositeOperation = "source-over";
            }

            return newStroke;
          });
        }
      }
    },
    [
      isDrawingActive,
      isShapeDrawing,
      currentShape,
      drawingColor,
      drawingSize,
      drawingTool,
    ]
  );

  const stopDrawing = useCallback(() => {
    if (isShapeDrawing && currentShape) {
      setDrawingShapes((prev) => [...prev, currentShape]);
      setCurrentShape(null);
      setIsShapeDrawing(false);
      saveToUndoStack();
    } else if (isDrawingActive && currentStroke.length > 0) {
      setDrawingStrokes((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          points: currentStroke,
          color: drawingColor,
          size: drawingSize,
          tool: drawingTool,
        },
      ]);
      setCurrentStroke([]);
      saveToUndoStack();
    }
    setIsDrawingActive(false);
  }, [
    isDrawingActive,
    isShapeDrawing,
    currentStroke,
    currentShape,
    drawingColor,
    drawingSize,
    drawingTool,
  ]);

  // Helper functions for advanced drawing
  const saveToUndoStack = useCallback(() => {
    const state = {
      strokes: drawingStrokes,
      shapes: drawingShapes,
      texts: drawingTexts,
      timestamp: Date.now(),
    };
    setUndoStack((prev) => [...prev.slice(-19), state]); // Keep last 20 states
  }, [drawingStrokes, drawingShapes, drawingTexts]);

  const drawShape = useCallback(
    (ctx: CanvasRenderingContext2D, shape: DrawingShape) => {
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = shape.size;
      ctx.beginPath();

      switch (shape.type) {
        case "rectangle":
          ctx.rect(
            shape.startX,
            shape.startY,
            shape.endX - shape.startX,
            shape.endY - shape.startY
          );
          break;
        case "circle":
          const radius = Math.sqrt(
            Math.pow(shape.endX - shape.startX, 2) +
              Math.pow(shape.endY - shape.startY, 2)
          );
          ctx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
          break;
        case "line":
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.endX, shape.endY);
          break;
        case "arrow":
          // Draw line
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.endX, shape.endY);

          // Draw arrowhead
          const angle = Math.atan2(
            shape.endY - shape.startY,
            shape.endX - shape.startX
          );
          const arrowLength = 20;
          ctx.lineTo(
            shape.endX - arrowLength * Math.cos(angle - Math.PI / 6),
            shape.endY - arrowLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(shape.endX, shape.endY);
          ctx.lineTo(
            shape.endX - arrowLength * Math.cos(angle + Math.PI / 6),
            shape.endY - arrowLength * Math.sin(angle + Math.PI / 6)
          );
          break;
      }
      ctx.stroke();
    },
    []
  );

  const redrawCanvas = useCallback(() => {
    if (!drawingCanvasRef.current) return;

    const ctx = drawingCanvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(
      0,
      0,
      drawingCanvasRef.current.width,
      drawingCanvasRef.current.height
    );

    // Redraw all strokes
    drawingStrokes.forEach((stroke) => {
      if (stroke.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.globalCompositeOperation =
          stroke.tool === "eraser"
            ? "destination-out"
            : stroke.tool === "highlighter"
              ? "multiply"
              : "source-over";
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      }
    });

    // Redraw all shapes
    drawingShapes.forEach((shape) => {
      drawShape(ctx, shape);
    });

    // Redraw all texts
    drawingTexts.forEach((text) => {
      ctx.fillStyle = text.color;
      ctx.font = `${text.size}px ${text.font}`;
      ctx.fillText(text.text, text.x, text.y);
    });
  }, [drawingStrokes, drawingShapes, drawingTexts, drawShape]);

  const clearDrawing = useCallback(() => {
    if (drawingCanvasRef.current) {
      const ctx = drawingCanvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          drawingCanvasRef.current.width,
          drawingCanvasRef.current.height
        );
      }
    }
    saveToUndoStack();
    setDrawingStrokes([]);
    setDrawingShapes([]);
    setDrawingTexts([]);
    setCurrentStroke([]);
  }, [saveToUndoStack]);

  const undoDrawing = useCallback(() => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1];
      setDrawingStrokes(lastState.strokes);
      setDrawingShapes(lastState.shapes);
      setDrawingTexts(lastState.texts);
      setUndoStack((prev) => prev.slice(0, -1));
      redrawCanvas();
    }
  }, [undoStack, redrawCanvas]);

  const startRecording = useCallback(async () => {
    try {
      // Get screen capture
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });

      screenStreamRef.current = screenStream;

      // Get camera stream if enabled
      if (isCameraEnabled) {
        try {
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 200, height: 200 },
            audio: isMicEnabled,
          });
          cameraStreamRef.current = cameraStream;

          // Display camera feed
          if (cameraRef.current) {
            cameraRef.current.srcObject = cameraStream;
          }
        } catch (error) {
          console.error("Camera access denied:", error);
        }
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(screenStream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const recording: Recording = {
          id: Date.now().toString(),
          blob,
          timestamp: new Date(),
          duration: recordingDuration,
        };
        setRecordings((prev) => [...prev, recording]);
        setRecordingDuration(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setShowControls(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }, [isCameraEnabled, isMicEnabled, recordingDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRecording(false);
    setIsPaused(false);
    setShowControls(false);
    setIsDrawing(false);
    clearDrawing();
  }, [clearDrawing]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        // Resume timer
        timerRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        // Pause timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  }, [isRecording, isPaused]);

  const downloadRecording = useCallback((recording: Recording) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recording-${recording.timestamp.toISOString()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const deleteRecording = useCallback((id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const openStorageModal = useCallback((recording: Recording) => {
    setSelectedRecording(recording);
    setShowStorageModal(true);
  }, []);

  // Handle camera dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isRecording) return;

      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [isRecording]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      setCameraPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle controls dragging
  const handleControlsMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDraggingControls(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setControlsDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleControlsMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingControls) return;

      setControlsPosition({
        x: e.clientX - controlsDragOffset.x,
        y: e.clientY - controlsDragOffset.y,
      });
    },
    [isDraggingControls, controlsDragOffset]
  );

  const handleControlsMouseUp = useCallback(() => {
    setIsDraggingControls(false);
  }, []);

  useEffect(() => {
    if (isDraggingControls) {
      document.addEventListener("mousemove", handleControlsMouseMove);
      document.addEventListener("mouseup", handleControlsMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleControlsMouseMove);
        document.removeEventListener("mouseup", handleControlsMouseUp);
      };
    }
  }, [isDraggingControls, handleControlsMouseMove, handleControlsMouseUp]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className='relative w-full min-h-[600px] bg-gray-50'>
      {/* Enhanced Floating Control Panel */}
      <div
        className='fixed z-[9999] select-none'
        style={{
          left:
            controlsPosition.x ||
            (isClient ? window.innerWidth / 2 - 250 : 200),
          top: controlsPosition.y || 20,
          cursor: isDraggingControls ? "grabbing" : "default",
        }}
      >
        <div
          className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-xl overflow-hidden'
          style={{ pointerEvents: "auto" }}
        >
          {/* Drag Handle */}
          <div
            className='flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700 cursor-grab active:cursor-grabbing'
            onMouseDown={handleControlsMouseDown}
          >
            <div className='flex items-center space-x-2'>
              <GripVertical className='w-4 h-4 text-gray-400' />
              <div className='flex items-center space-x-2'>
                <Monitor className='w-4 h-4 text-yellow-400' />
                <span className='text-sm font-semibold text-white'>
                  ScreenFlowr
                </span>
              </div>
            </div>
            <div className='flex items-center space-x-1'>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700'
                onClick={() => setIsControlsMinimized(!isControlsMinimized)}
              >
                {isControlsMinimized ? (
                  <Maximize2 className='w-3 h-3' />
                ) : (
                  <Minimize2 className='w-3 h-3' />
                )}
              </Button>
            </div>
          </div>

          {/* Main Controls */}
          <div
            className={`transition-all duration-300 ${isControlsMinimized ? "h-0 overflow-hidden" : "p-4"}`}
          >
            <div className='flex flex-col space-y-3'>
              {/* Recording Controls Row */}
              <div className='flex items-center space-x-3'>
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-6 py-2 rounded-xl shadow-lg transition-all duration-200'
                  >
                    <Video className='w-4 h-4 mr-2' />
                    Start Recording
                  </Button>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <Button
                      onClick={stopRecording}
                      className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl shadow-lg'
                    >
                      <Square className='w-4 h-4 mr-2' />
                      Stop
                    </Button>
                    <Button
                      onClick={pauseRecording}
                      variant='outline'
                      className='bg-gray-700 border-gray-600 text-white hover:bg-gray-600 px-4 py-2 rounded-xl'
                    >
                      {isPaused ? (
                        <Play className='w-4 h-4 mr-2' />
                      ) : (
                        <Pause className='w-4 h-4 mr-2' />
                      )}
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <div className='flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-xl'>
                      <div className='w-2 h-2 bg-red-500 rounded-full recording-pulse status-glow'></div>
                      <span className='text-sm font-mono text-white'>
                        {formatDuration(recordingDuration)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Device Controls Row */}
              <div className='flex items-center justify-between bg-gray-800/50 rounded-xl p-3'>
                <div className='flex items-center space-x-2'>
                  <span className='text-xs font-medium text-gray-300 uppercase tracking-wide'>
                    Devices
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setIsCameraEnabled(!isCameraEnabled)}
                    className={`h-8 w-8 rounded-lg transition-all ${
                      isCameraEnabled
                        ? "bg-yellow-500 text-black hover:bg-yellow-400"
                        : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                    }`}
                    title={isCameraEnabled ? "Disable camera" : "Enable camera"}
                  >
                    {isCameraEnabled ? (
                      <Camera className='w-4 h-4' />
                    ) : (
                      <CameraOff className='w-4 h-4' />
                    )}
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowCameraPreview(!showCameraPreview)}
                    className={`h-8 w-8 rounded-lg transition-all ${
                      showCameraPreview
                        ? "bg-blue-500 text-white hover:bg-blue-400"
                        : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                    }`}
                    title={
                      showCameraPreview
                        ? "Hide camera preview"
                        : "Show camera preview"
                    }
                  >
                    {showCameraPreview ? (
                      <Eye className='w-4 h-4' />
                    ) : (
                      <EyeOff className='w-4 h-4' />
                    )}
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setIsMicEnabled(!isMicEnabled)}
                    className={`h-8 w-8 rounded-lg transition-all ${
                      isMicEnabled
                        ? "bg-green-500 text-white hover:bg-green-400"
                        : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                    }`}
                    title={
                      isMicEnabled ? "Mute microphone" : "Enable microphone"
                    }
                  >
                    {isMicEnabled ? (
                      <Mic className='w-4 h-4' />
                    ) : (
                      <MicOff className='w-4 h-4' />
                    )}
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowDrawingPanel(!showDrawingPanel)}
                    className={`h-8 w-8 rounded-lg transition-all ${
                      showDrawingPanel
                        ? "bg-purple-500 text-white hover:bg-purple-400"
                        : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                    }`}
                    title='Drawing tools'
                  >
                    <Palette className='w-4 h-4' />
                  </Button>
                </div>
              </div>

              {/* Status Indicators */}
              <div className='flex items-center justify-between text-xs text-gray-400'>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-1'>
                    <Layers className='w-3 h-3' />
                    <span>Always on top</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <Monitor className='w-3 h-3' />
                    <span>All screens</span>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  {isCameraEnabled && (
                    <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
                  )}
                  {isMicEnabled && (
                    <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                  )}
                  {showDrawingPanel && (
                    <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Preview - Always visible when enabled */}
      {(showCameraPreview || (isRecording && isCameraEnabled)) && (
        <div
          className={`absolute w-32 h-32 bg-black rounded-full overflow-hidden border-4 shadow-lg z-40 ${
            isRecording
              ? "draggable-camera border-yellow-400"
              : "border-gray-300"
          }`}
          style={{
            left: `${cameraPosition.x}px`,
            top: `${cameraPosition.y}px`,
            cursor: isRecording
              ? isDragging
                ? "grabbing"
                : "grab"
              : "default",
          }}
          onMouseDown={isRecording ? handleMouseDown : undefined}
        >
          <video
            ref={cameraRef}
            autoPlay
            muted
            className='w-full h-full object-cover'
          />
          {!isRecording && (
            <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
              <span className='text-white text-xs font-medium'>Preview</span>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Drawing Tools Panel */}
      {(showDrawingPanel || isRecording) && (
        <div className='absolute top-4 right-4 z-[1000]'>
          <div
            className='bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-[280px] relative'
            style={{ pointerEvents: "auto" }}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900'>Drawing Tools</h3>
              <div className='flex items-center space-x-2'>
                <Button
                  variant={isDrawing ? "default" : "outline"}
                  size='sm'
                  onClick={() => setIsDrawing(!isDrawing)}
                  className='h-8'
                >
                  {isDrawing ? "Drawing On" : "Drawing Off"}
                </Button>
                {!isRecording && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowDrawingPanel(false)}
                    className='h-8 w-8 p-0'
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>

            {isDrawing && (
              <div className='space-y-4'>
                {/* Tool Selection */}
                <div className='grid grid-cols-4 gap-2'>
                  <Button
                    variant={drawingTool === "pen" ? "default" : "outline"}
                    size='sm'
                    onClick={() => setDrawingTool("pen")}
                    className='h-10 flex flex-col items-center justify-center'
                  >
                    <MousePointer2 className='w-4 h-4' />
                    <span className='text-xs'>Pen</span>
                  </Button>
                  <Button
                    variant={
                      drawingTool === "highlighter" ? "default" : "outline"
                    }
                    size='sm'
                    onClick={() => setDrawingTool("highlighter")}
                    className='h-10 flex flex-col items-center justify-center'
                  >
                    <Highlighter className='w-4 h-4' />
                    <span className='text-xs'>Mark</span>
                  </Button>
                  <Button
                    variant={drawingTool === "eraser" ? "default" : "outline"}
                    size='sm'
                    onClick={() => setDrawingTool("eraser")}
                    className='h-10 flex flex-col items-center justify-center'
                  >
                    <Eraser className='w-4 h-4' />
                    <span className='text-xs'>Erase</span>
                  </Button>
                  <Button
                    variant={drawingTool === "text" ? "default" : "outline"}
                    size='sm'
                    onClick={() => setDrawingTool("text")}
                    className='h-10 flex flex-col items-center justify-center'
                  >
                    <Type className='w-4 h-4' />
                    <span className='text-xs'>Text</span>
                  </Button>
                </div>

                {/* Shape Tools */}
                <div className='grid grid-cols-4 gap-2'>
                  <Button
                    variant={
                      drawingTool === "rectangle" ? "default" : "outline"
                    }
                    size='sm'
                    onClick={() => setDrawingTool("rectangle")}
                    className='h-10 flex flex-col items-center justify-center'
                  >
                    <RectangleIcon className='w-4 h-4' />
                    <span className='text-xs'>Rect</span>
                  </Button>
                  <Button
                    variant={drawingTool === "circle" ? "default" : "outline"}
                    size='sm'
                    onClick={() => setDrawingTool("circle")}
                    className='h-10 flex flex-col items-center justify-center'
                  >
                    <Circle className='w-4 h-4' />
                    <span className='text-xs'>Circle</span>
                  </Button>
                  <Button
                    variant={drawingTool === "arrow" ? "default" : "outline"}
                    size='sm'
                    onClick={() => setDrawingTool("arrow")}
                    className='h-10 flex flex-col items-center justify-center'
                  >
                    <ArrowRight className='w-4 h-4' />
                    <span className='text-xs'>Arrow</span>
                  </Button>
                  <Button
                    variant={drawingTool === "line" ? "default" : "outline"}
                    size='sm'
                    onClick={() => setDrawingTool("line")}
                    className='h-10 flex flex-col items-center justify-center'
                  >
                    <Minus className='w-4 h-4' />
                    <span className='text-xs'>Line</span>
                  </Button>
                </div>

                {/* Color and Size Controls */}
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium text-gray-700'>
                      Color
                    </label>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='color'
                        value={drawingColor}
                        onChange={(e) => setDrawingColor(e.target.value)}
                        className='w-8 h-8 rounded-lg border border-gray-300 cursor-pointer'
                      />
                      <div
                        className='w-8 h-8 rounded-lg border border-gray-300'
                        style={{ backgroundColor: drawingColor }}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <label className='text-sm font-medium text-gray-700'>
                        Size
                      </label>
                      <span className='text-sm text-gray-500'>
                        {drawingSize}px
                      </span>
                    </div>
                    <input
                      type='range'
                      min='1'
                      max='50'
                      value={drawingSize}
                      onChange={(e) => setDrawingSize(Number(e.target.value))}
                      className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                    />
                  </div>

                  {/* Quick Color Palette */}
                  <div className='grid grid-cols-8 gap-1'>
                    {[
                      "#FF0000",
                      "#00FF00",
                      "#0000FF",
                      "#FFFF00",
                      "#FF00FF",
                      "#00FFFF",
                      "#000000",
                      "#FFFFFF",
                    ].map((color) => (
                      <div
                        key={color}
                        className={`w-6 h-6 rounded cursor-pointer border-2 ${
                          drawingColor === color
                            ? "border-gray-800"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setDrawingColor(color)}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center justify-between pt-2 border-t'>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={undoDrawing}
                      disabled={undoStack.length === 0}
                      className='h-8'
                    >
                      <Undo2 className='w-4 h-4 mr-1' />
                      Undo
                    </Button>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={clearDrawing}
                    className='h-8'
                  >
                    <RotateCcw className='w-4 h-4 mr-1' />
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recordings List - Dashboard Optimized */}
      {recordings.length > 0 && (
        <div className='absolute bottom-4 left-4 right-4 z-50'>
          <div className='bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-h-80 overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Recent Recordings
              </h3>
              <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg'>
                {recordings.length}{" "}
                {recordings.length === 1 ? "recording" : "recordings"}
              </span>
            </div>
            <div className='space-y-3'>
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className='flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='p-2 bg-blue-50 rounded-lg'>
                      <Video className='w-5 h-5 text-blue-500' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-gray-900'>
                        Recording #{recording.id.slice(-4)}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {recording.timestamp.toLocaleDateString()} at{" "}
                        {recording.timestamp.toLocaleTimeString()}
                      </p>
                      <div className='flex items-center space-x-2 mt-1'>
                        <span className='text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full'>
                          {formatDuration(recording.duration)}
                        </span>
                        <span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full'>
                          {(recording.blob.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => downloadRecording(recording)}
                      className='hover:bg-blue-50 hover:border-blue-300'
                    >
                      <Download className='w-4 h-4 mr-1' />
                      Download
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => openStorageModal(recording)}
                      className='hover:bg-yellow-50 hover:border-yellow-300'
                    >
                      <Upload className='w-4 h-4 mr-1' />
                      Upload
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => deleteRecording(recording.id)}
                      className='hover:bg-red-50'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Drawing Canvas */}
      {(showDrawingPanel || isRecording) && isDrawing && (
        <canvas
          ref={drawingCanvasRef}
          className='absolute inset-0 w-full h-full drawing-canvas'
          style={{
            zIndex: 500,
            pointerEvents: isDrawing ? "auto" : "none",
            cursor:
              drawingTool === "eraser"
                ? "crosshair"
                : drawingTool === "text"
                  ? "text"
                  : ["rectangle", "circle", "arrow", "line"].includes(
                        drawingTool
                      )
                    ? "crosshair"
                    : "default",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      )}

      {/* Storage Modal */}
      {showStorageModal && selectedRecording && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold'>Upload Recording</h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowStorageModal(false)}
              >
                ×
              </Button>
            </div>
            <CloudStorage
              recording={selectedRecording}
              onUploadComplete={(platform, url) => {
                console.log(`Uploaded to ${platform}:`, url);
                setShowStorageModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
