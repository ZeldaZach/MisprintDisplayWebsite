import { createContext, useContext, useState, ReactNode } from 'react';

interface ImageViewerState {
    isOpen: boolean;
    imageSrc: string | null;
    cardName: string | null;
}

interface ImageViewerContextValue {
    state: ImageViewerState;
    openViewer: (src: string, name: string) => void;
    closeViewer: () => void;
}

const ImageViewerContext = createContext<ImageViewerContextValue | null>(null);

export const ImageViewerProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<ImageViewerState>({
        isOpen: false,
        imageSrc: null,
        cardName: null,
    });

    const openViewer = (src: string, name: string) => {
        setState({ isOpen: true, imageSrc: src, cardName: name });
    };

    const closeViewer = () => {
        setState({ isOpen: false, imageSrc: null, cardName: null });
    };

    return (
        <ImageViewerContext.Provider value={{ state, openViewer, closeViewer }}>
            {children}
        </ImageViewerContext.Provider>
    );
};

export const useImageViewer = () => {
    const context = useContext(ImageViewerContext);
    if (!context) {
        throw new Error('useImageViewer must be used within ImageViewerProvider');
    }
    return context;
};
