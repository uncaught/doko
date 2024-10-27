import {BrowserQRCodeReader, IScannerControls} from '@zxing/browser';
import {Result} from '@zxing/library';
import {ReactElement, useEffect, useRef} from 'react';

// Taken from https://github.com/JodusNodus/react-qr-reader (abandoned)

const isMediaDevicesSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices;

const videoId = 'video';

export interface Props {
  onResult: (result: Result | undefined | null, error: Error | undefined | null) => void;
}

export default function QrReader({onResult}: Props): ReactElement {
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    if (!isMediaDevicesSupported) {
      return;
    }

    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: 300,
    });

    codeReader
      .decodeFromConstraints({video: {facingMode: {ideal: 'environment'}}}, videoId, (res, err) => {
        // NotFoundException occurs for every scan attempt with no result:
        if (!err || err.name !== 'NotFoundException') {
          onResult(res, err);
        }
      })
      .then((controls: IScannerControls) => (controlsRef.current = controls))
      .catch((error: Error) => onResult(null, error));

    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  return (
    <section>
      <div
        style={{
          width: '100%',
          paddingTop: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {!isMediaDevicesSupported && <div>MediaDevices-API not available</div>}
        {isMediaDevicesSupported && (
          <video
            muted
            id={videoId}
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'block',
              overflow: 'hidden',
              position: 'absolute',
              transform: 'scaleX(-1)',
            }}
          />
        )}
      </div>
    </section>
  );
}
