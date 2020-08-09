import styled from "@emotion/styled";

export const HorizontalWrapper = styled.div`
  display: flex;
`;
export const Icon = styled.i`
  @import url("https://fonts.googleapis.com/icon?family=Material+Icons");
`;
Icon.defaultProps = {
  className: "material-icons",
};
export const ProfileImage = styled.img<{ size?: number | string }>`
  width: 72px;
  height: 72px;
  border-radius: 72px;
  margin-right: 12px;
  ${({ size }) => {
    if (!size) return ``;
    if (typeof size === "number")
      return `
    width: ${size}px;
    height: ${size}px;  
  `;
    else
      return `
    width: ${size};
    height: ${size}
  `;
  }}
`;
