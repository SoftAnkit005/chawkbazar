import { UploadIcon } from "@components/icons/upload-icon";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloseIcon } from "@components/icons/close-icon";
import { ImageUploadIcon } from "@components/icons/image-upload-icon";

interface fileState {
	id: string;
	src: string;
  }
  export default function Uploader({ onSetImage, emptyImage, page }: any) {
	const [files, setFiles] = useState<fileState[]>([]);
	const [validFiles, setValidFiles] = useState([]);
    const {
		getRootProps,
		getInputProps,
		acceptedFiles,
		open,
		isDragAccept,
		isFocused,
		isDragReject,
	  } = useDropzone({
		accept: "image/*",
		multiple: true,
		maxSize: ["imageDesktopUrl", "imageMobileUrl"].includes("gallery")
		  ? 5242880
		  : 614400,
		noKeyboard: true,
		onDrop: (acceptedFiles) => {
		  if (acceptedFiles.length) {
			acceptedFiles.map((file, index) => {
			  console.log("file--------============", file, index);
			  const reader = new FileReader();
			  reader.onload = function (e) {
				setFiles((prevState: any) => [
				  ...prevState,
				  { id: file.name, src: e.target?.result },
				]);
			  };
			  reader.readAsDataURL(file);
			  return file;
			});
		  }
		},
	  });
	
	  const handleDelete = (image: string) => {
		const images = validFiles.filter((file: any) => file.src !== image);
		setFiles(images);
		setValidFiles(images);
	  };
	  const thumbs = validFiles?.map((file: any, idx) => {
		if (file.id) {
		  return (
			<div
			  className="inline-flex flex-col overflow-hidden border-dashed border border-gray-500 rounded mt-2 mr-2 relative"
			  key={idx}
			>
			  <div className={`flex items-center justify-center min-w-0 ${(page === 'personalizeJewellery')?'w-20 h-20':'w-16 h-16'}  overflow-hidden bg-gray-300`}>
				<img src={file.src} />
			  </div>
			  <button
				className="w-3 h-3 flex items-center justify-center rounded-full bg-red-600 text-xs text-light absolute top-1 right-1 shadow-xl outline-none"
				onClick={() => handleDelete(file.src)}
			  >
				<CloseIcon className="text-white" width={10} height={10} />
			  </button>
			</div>
		  );
		}
	  });
	  useEffect(() => {
		if (emptyImage) {
		  setFiles([]);
		  setValidFiles([]);
		}
	  }, [emptyImage]);
	  useEffect(() => {
		files.forEach((file: any) => URL.revokeObjectURL(file.src));
		let filteredArray = files.reduce((file, current) => {
		  const x = file.find((item: any) => item.id === current.id);
		  if (!x) {
			return file.concat([current]);
		  } else {
			return file;
		  }
		}, []);
		setValidFiles([...filteredArray]);
		onSetImage([...filteredArray]);
	  }, [files]);
		
	  return (
		<section className="upload">
		  <div
			{...getRootProps({
			  isDragAccept,
			  isFocused,
			  isDragReject,
			  className: (page === 'personalizeJewellery')?'h-56 border-dashed border-2 rounded flex flex-col justify-center items-center cursor-pointer border-gray-500 focus:border-gray-600 focus:outline-none bg-white': 'h-36 border-dashed border-2 rounded flex flex-col justify-center items-center cursor-pointer border-gray-500 focus:border-gray-600 focus:outline-none',
			})}
			onClick={open}
		  >
			<input
			  {...getInputProps({
				// onChange: handleFile,
			  })}
			/>
			{/* <UploadIcon className="text-muted-light" /> */}
			<ImageUploadIcon/>
			<p className="text-body text-sm mt-4 text-center">
			  <span className="text-accent font-semibold">Upload an image</span> or
			  drag and drop <br />
			  <span className="text-xs text-body">PNG, JPG</span>
			</p>
		  </div>
		  {!!thumbs.length && (
        <aside className="flex flex-wrap mt-2">
          {!!thumbs.length && thumbs}
        </aside>
      )}
    </section>
  );
}
	