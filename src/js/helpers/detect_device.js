const MOBILE_REG_EXP =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i;

const isMobile = () => MOBILE_REG_EXP.test(navigator.userAgent);

const IS_MOBILE = isMobile();

export default IS_MOBILE;

export { isMobile };
