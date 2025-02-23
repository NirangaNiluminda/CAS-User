// components/QuizMonitor.tsx
import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        let blurCount = 0;
        let visibilityCount = 0;
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                visibilityCount++;
                const violation: Violation = {
                    type: 'Tab Switch',
                    timestamp: new Date().toISOString(),
                    count: visibilityCount
                };
                setViolations(prev => [...prev, violation]);
                onViolation(violation);
            }
        };

        const handleBlur = () => {
            blurCount++;
            const violation: Violation = {
                type: 'Window Switch',
                timestamp: new Date().toISOString(),
                count: blurCount
            };
            setViolations(prev => [...prev, violation]);
            onViolation(violation);
        };

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                const violation: Violation = {
                    type: 'Mouse Exit',
                    timestamp: new Date().toISOString()
                };
                setViolations(prev => [...prev, violation]);
                onViolation(violation);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'f')) ||
                (e.altKey && e.key === 'Tab') ||
                (e.key === 'Print' || e.key === 'PrintScreen')
            ) {
                e.preventDefault();
                const violation: Violation = {
                    type: 'Keyboard Shortcut',
                    timestamp: new Date().toISOString(),
                    key: e.key
                };
                setViolations(prev => [...prev, violation]);
                onViolation(violation);
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            const violation: Violation = {
                type: 'Right Click',
                timestamp: new Date().toISOString()
            };
            setViolations(prev => [...prev, violation]);
            onViolation(violation);
        };

        const enableFullscreen = async () => {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                    setIsFullscreen(true);
                }
            } catch (err) {
                console.error('Failed to enter fullscreen:', err);
            }
        };

        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!document.fullscreenElement;
            setIsFullscreen(isCurrentlyFullscreen);
            
            if (!isCurrentlyFullscreen) {
                const violation: Violation = {
                    type: 'Fullscreen Exit',
                    timestamp: new Date().toISOString()
                };
                setViolations(prev => [...prev, violation]);
                onViolation(violation);
                enableFullscreen();
            }
        };

        // Initialize fullscreen and event listeners
        enableFullscreen();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('mouseleave', handleMouseLeave as EventListener);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('mouseleave', handleMouseLeave as EventListener);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [onViolation]);

    return (
        <div className="fixed top-4 left-4 z-50 space-y-2">
            {!isFullscreen && (
                <Alert variant="destructive">
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                        Please enter fullscreen mode to continue the quiz
                    </AlertDescription>
                </Alert>
            )}
            {violations.length > 0 && (
                <Card className="p-4 bg-yellow-50 border-yellow-500">
                    <p className="text-yellow-700 font-medium">
                        {violations.length} suspicious activities detected
                    </p>
                </Card>
            )}
        </div>
    );
};

export default QuizMonitor;