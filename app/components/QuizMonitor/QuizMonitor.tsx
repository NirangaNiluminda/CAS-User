// components/QuizMonitor.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card } from "../ui/card";

interface Violation {
    type: string;
    timestamp: string;
    count?: number;
    key?: string;
}

interface QuizMonitorProps {
    onViolation: (violation: Violation) => void;
}

const QuizMonitor: React.FC<QuizMonitorProps> = ({ onViolation }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [violations, setViolations] = useState<Violation[]>([]);
    const [showWarnings, setShowWarnings] = useState(true);

    // Create a reusable violation handler
    const handleViolation = useCallback((violationType: string, key?: string, count?: number) => {
        const violation: Violation = {
            type: violationType,
            timestamp: new Date().toISOString(),
            ...(key && { key }),
            ...(count && { count })
        };
        
        setViolations(prev => [...prev, violation]);
        onViolation(violation);
    }, [onViolation]);

    // Enable fullscreen mode
    const enableFullscreen = useCallback(async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
            } else if ((document.documentElement as any).mozRequestFullScreen) {
                await (document.documentElement as any).mozRequestFullScreen();
                setIsFullscreen(true);
            } else if ((document.documentElement as any).webkitRequestFullscreen) {
                await (document.documentElement as any).webkitRequestFullscreen();
                setIsFullscreen(true);
            } else if ((document.documentElement as any).msRequestFullscreen) {
                await (document.documentElement as any).msRequestFullscreen();
                setIsFullscreen(true);
            }
        } catch (err) {
            console.error('Failed to enter fullscreen:', err);
        }
    }, []);

    // Set up event listeners
    useEffect(() => {
        let blurCount = 0;
        let visibilityCount = 0;
        let copyPasteCount = 0;
        
        // Tab visibility detection
        const handleVisibilityChange = () => {
            if (document.hidden) {
                visibilityCount++;
                handleViolation('Tab Switch', undefined, visibilityCount);
            }
        };

        // Window focus detection
        const handleBlur = () => {
            blurCount++;
            handleViolation('Window Switch', undefined, blurCount);
        };

        // Mouse exit detection
        const handleMouseLeave = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            // Check if mouse is leaving the viewport in any direction
            if (clientY <= 0 || clientX <= 0 || clientX >= innerWidth || clientY >= innerHeight) {
                handleViolation('Mouse Exit');
            }
        };

        // Keyboard shortcut detection
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent common shortcuts
            if (
                (e.ctrlKey && ['a', 'c', 'v', 'f', 'p', 's'].includes(e.key.toLowerCase())) ||
                (e.altKey && e.key === 'Tab') ||
                (e.key === 'Print' || e.key === 'PrintScreen' || e.key === 'F12')
            ) {
                e.preventDefault();
                handleViolation('Keyboard Shortcut', e.key);
            }
        };

        // Right-click detection
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            handleViolation('Right Click');
        };

        // Copy/paste detection
        const handleCopyPaste = (e: ClipboardEvent) => {
            e.preventDefault();
            copyPasteCount++;
            handleViolation('Copy Paste', e.type, copyPasteCount);
        };

        // Fullscreen change detection
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement || 
                (document as any).mozFullScreenElement ||
                (document as any).webkitFullscreenElement || 
                (document as any).msFullscreenElement
            );
            
            setIsFullscreen(isCurrentlyFullscreen);
            
            if (!isCurrentlyFullscreen) {
                handleViolation('Fullscreen Exit');
                // Try to re-enable fullscreen after a short delay
                setTimeout(() => {
                    enableFullscreen();
                }, 1000);
            }
        };

        // Initialize fullscreen
        enableFullscreen();
        
        // Set up event listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopyPaste);
        document.addEventListener('cut', handleCopyPaste);
        document.addEventListener('paste', handleCopyPaste);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        // Hide warning alerts after 10 seconds
        const warningTimer = setTimeout(() => {
            setShowWarnings(false);
        }, 10000);

        // Cleanup all event listeners
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopyPaste);
            document.removeEventListener('cut', handleCopyPaste);
            document.removeEventListener('paste', handleCopyPaste);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
            clearTimeout(warningTimer);
        };
    }, [handleViolation, enableFullscreen]);

    // Detect "face" presence via webcam (optional feature for detecting multiple people)
    useEffect(() => {
        // This is a placeholder for actual webcam-based face detection
        // In a full implementation, you would use a library like face-api.js
        
        // For demonstration, this is commented out, but you could implement:
        /*
        const setupFaceDetection = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();
                
                // Set up face detection with face-api.js or similar library
                // Then periodically check for multiple faces
                const checkInterval = setInterval(() => {
                    // If multiple faces detected:
                    // handleViolation('Multiple People', undefined, faceCount);
                }, 5000);
                
                return () => {
                    clearInterval(checkInterval);
                    stream.getTracks().forEach(track => track.stop());
                };
            } catch (err) {
                console.error('Face detection setup failed:', err);
            }
        };
        
        setupFaceDetection();
        */
    }, [handleViolation]);

    return (
        <>
            {showWarnings && (
                <div className="fixed top-4 left-4 z-50 space-y-2 max-w-md">
                    {!isFullscreen && (
                        <Alert variant="destructive">
                            <AlertTitle>Warning: Exam Security</AlertTitle>
                            <AlertDescription>
                                Please enter fullscreen mode to continue the quiz. Exiting fullscreen may be recorded as a violation.
                            </AlertDescription>
                        </Alert>
                    )}
                    {violations.length > 0 && (
                        <Card className="p-4 bg-yellow-50 border-yellow-500">
                            <p className="text-yellow-700 font-medium">
                                {violations.length} suspicious activities detected
                            </p>
                            <p className="text-yellow-600 text-sm mt-1">
                                These activities are being monitored and recorded.
                            </p>
                        </Card>
                    )}
                </div>
            )}
        </>
    );
};

export default QuizMonitor;