export const ctrlWrapper = (controller) => {
    return async (req, res, next) => {
      try {
        // Controller fonksiyonunu await ile çağırıyoruz
        await controller(req, res, next);
      } catch (error) {
        // Hata durumunda, Express'in next() fonksiyonunu çağırarak hata iletisini gönderiyoruz
        next(error);
      }
    };
  };
  
  export default ctrlWrapper;
  