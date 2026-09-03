const LETTERHEAD_WIDTH = 1900;
const LETTERHEAD_HEIGHT = 200;

const readImage = (
  file
) => {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const image =
          new Image();

        image.onload = () => {
          resolve(image);
        };

        image.onerror = () => {
          reject(
            new Error(
              "Gambar tidak dapat dibaca."
            )
          );
        };

        image.src =
          reader.result;
      };

      reader.onerror = () => {
        reject(
          new Error(
            "File gambar tidak dapat dibaca."
          )
        );
      };

      reader.readAsDataURL(
        file
      );
    }
  );
};

const resizeLetterhead = async (
  file
) => {
  if (!file) {
    throw new Error(
      "File belum dipilih."
    );
  }

  const allowedTypes = [
    "image/png",
    "image/jpeg",
  ];

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    throw new Error(
      "Kop surat hanya boleh menggunakan PNG atau JPG/JPEG."
    );
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {
    throw new Error(
      "Ukuran file maksimal 5 MB."
    );
  }

  const image =
    await readImage(
      file
    );

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    LETTERHEAD_WIDTH;

  canvas.height =
    LETTERHEAD_HEIGHT;

  const context =
    canvas.getContext(
      "2d"
    );

  if (!context) {
    throw new Error(
      "Canvas tidak dapat digunakan oleh browser."
    );
  }

  context.clearRect(
    0,
    0,
    LETTERHEAD_WIDTH,
    LETTERHEAD_HEIGHT
  );

  context.drawImage(
    image,
    0,
    0,
    LETTERHEAD_WIDTH,
    LETTERHEAD_HEIGHT
  );

  const blob =
    await new Promise(
      (resolve) => {
        canvas.toBlob(
          (result) =>
            resolve(result),
          "image/png"
        );
      }
    );

  if (!blob) {
    throw new Error(
      "Gagal membuat file kop surat."
    );
  }

  const outputName =
    file.name.replace(
      /\.[^/.]+$/,
      ""
    ) +
    "-1900x200.png";

  return new File(
    [blob],
    outputName,
    {
      type: "image/png",
      lastModified:
        Date.now(),
    }
  );
};

const getImageDimensions =
  (file) => {
    return new Promise(
      (resolve, reject) => {
        const image =
          new Image();

        const objectUrl =
          URL.createObjectURL(
            file
          );

        image.onload = () => {
          URL.revokeObjectURL(
            objectUrl
          );

          resolve({
            width:
              image.naturalWidth,
            height:
              image.naturalHeight,
          });
        };

        image.onerror = () => {
          URL.revokeObjectURL(
            objectUrl
          );

          reject(
            new Error(
              "Gambar tidak dapat dibaca."
            )
          );
        };

        image.src =
          objectUrl;
      }
    );
  };

export {
  LETTERHEAD_WIDTH,
  LETTERHEAD_HEIGHT,
  resizeLetterhead,
  getImageDimensions,
};