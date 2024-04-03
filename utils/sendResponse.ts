export const sendResponse = (token: string, res: Response) => {
  res.status(200).json({
    success: true,
    token,
  });
};
