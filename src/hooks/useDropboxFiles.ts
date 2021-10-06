import { useState, useEffect } from "react";
import { listDropboxFiles } from "../utils/dropboxUtils";

type FileList = {
  id: string;
  folderName: string;
  fileName: string;
  pathAndfileName: string;
  isDownloadable: boolean;
};

const useDropboxFiles = (token): FileList[] => {
  const [files, setFiles] = useState<FileList[]>(undefined);

  const getDropboxFiles = async () => {
    const fileList = await listDropboxFiles(token, "");
    // throwing away folders, as we only want the root
    // If wanted other folders, we would need to recurse through folders.
    const filesTemp = fileList.entries
      .map((entry) => {
        if (entry[".tag"] === "file") {
          return {
            id: entry.id,
            folderName: "/",
            fileName: entry.name,
            pathAndfileName: entry.path_display,
            isDownloadable: entry.is_downloadable,
          };
        }
      })
      .filter((entry) => entry?.fileName);
    console.log("filesTemp", filesTemp);
    setFiles(filesTemp);
  };

  useEffect(() => {
    getDropboxFiles();
  }, []);

  return files;
};

export default useDropboxFiles;
