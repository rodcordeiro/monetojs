type objectValue = Value | object | boolean | unknown;

export const cleanReturned = (
  object: Record<string, objectValue>,
  fieldsToReturn: string[] = [],
) => {
  const fieldsToClean = [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'password',
  ];

  const cleanObject = (obj: objectValue): objectValue => {
    if (Array.isArray(obj)) {
      return obj.map((item) => cleanObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).reduce(
        (acc: Record<string, objectValue>, key) => {
          if (fieldsToClean.includes(key) && !fieldsToReturn.includes(key)) {
            return acc;
          }

          acc[key] =
            typeof (obj as Record<string, objectValue>)[key] === 'object' &&
            (obj as Record<string, objectValue>)[key] !== null
              ? cleanObject((obj as Record<string, objectValue>)[key])
              : (obj as Record<string, objectValue>)[key];

          return acc;
        },
        {},
      );
    }

    return obj;
  };

  return cleanObject(object);
};
