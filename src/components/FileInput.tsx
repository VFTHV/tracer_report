import React, { ChangeEvent, FC } from 'react';

interface FileInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: string;
  name: string;
  accept: string;
}

const FileInput: FC<FileInputProps> = ({
  onChange,
  children,
  name,
  accept,
}) => {
  return (
    <div className="col-12 col-sm-6 col-lg-3 my-2">
      <label htmlFor={name} className="mr-2">
        {children}
      </label>
      <input
        className="form-control"
        id={name}
        name={name}
        type="file"
        onChange={onChange}
        accept={accept}
      />
    </div>
  );
};

export default FileInput;
