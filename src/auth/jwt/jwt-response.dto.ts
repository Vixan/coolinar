/**
 * JWT response object sent on successful authentication.
 *
 * @interface JwtResponseDto
 */
export interface JwtResponseDto {
  accessToken: string;
  expiresIn: number;
}
