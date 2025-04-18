import React from 'react';
import path from 'utils/common/path';
import { useDispatch } from 'react-redux';
import { browseFiles } from 'providers/ReduxStore/slices/collections/actions';
import { IconX } from '@tabler/icons';
import { isWindowsOS } from 'utils/common/platform';

const FilePickerEditor = ({ value, onChange, collection, isSingleFilePicker = false }) => {
  const dispatch = useDispatch();
  const filenames = (isSingleFilePicker ? [value] : value || [])
    .filter((v) => v != null && v != '')
    .map((v) => {
      const separator = isWindowsOS() ? '\\' : '/';
      return v.split(separator).pop();
    });

  // title is shown when hovering over the button
  const title = filenames.map((v) => `- ${v}`).join('\n');

  const browse = () => {
    dispatch(browseFiles([], [!isSingleFilePicker ? "multiSelections": ""]))
      .then((filePaths) => {
        // If file is in the collection's directory, then we use relative path
        // Otherwise, we use the absolute path
        filePaths = filePaths.map((filePath) => {
          const collectionDir = collection.pathname;

          if (filePath.startsWith(collectionDir)) {
            return path.relative(collectionDir, filePath);
          }

          return filePath;
        });

        onChange(isSingleFilePicker ? filePaths[0] : filePaths);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const clear = () => {
    onChange(isSingleFilePicker ? '' : []);
  };

  const renderButtonText = (filenames) => {
    if (filenames.length == 1) {
      return filenames[0];
    }
    return filenames.length + ' file(s) selected';
  };

  return filenames.length > 0 ? (
    <div
      className="btn btn-secondary px-1"
      style={{ fontWeight: 400, width: '100%', textOverflow: 'ellipsis', overflowX: 'hidden' }}
      title={title}
    >
      <button className="align-middle" onClick={clear}>
        <IconX size={18} />
      </button>
      &nbsp;
      {renderButtonText(filenames)}
    </div>
  ) : (
    <button className="btn btn-secondary px-1" style={{ width: '100%' }} onClick={browse}>
      {isSingleFilePicker ? 'Select File' : 'Select Files'}
    </button>
  );
};

export default FilePickerEditor;