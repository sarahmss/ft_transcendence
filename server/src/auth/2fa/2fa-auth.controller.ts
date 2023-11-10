import { Response } from 'express';
import { UserRequest } from "src/helpers/types.helper";
import { TwoFaAuthService } from "./2fa-auth.service";
import { TwoFaAuthDto } from "./dto/2fa-auth.dto";
import { JwtService } from "@nestjs/jwt";
import {
	Body,
	Controller,
	Get,
	Post,
	BadRequestException,
	Query,
	Req,
	Res,
	ParseUUIDPipe
} from "@nestjs/common";
import { MessagesHelper } from "src/helpers/messages.helpers";

@Controller("2fa-auth")
	export class TwoFaAuthController {
		constructor(
			private _2faService: TwoFaAuthService,
			private _jwtService: JwtService,
		){}

		/********************************* GET ******************************/
		@Get('generate')
		async generate(@Req() request: UserRequest) {
			const userId = request.user;
			return this._2faService.createQrCode(`${userId}`);
		}

		/********************************* POST ******************************/
		@Post('enable')
		async enable(@Req() request: UserRequest, @Body() body: TwoFaAuthDto) {
			const userId = request.user;
			return this._2faService.SetTwoFactorAuthOn(`${userId}`, body.code);
		}

		@Post('disable')
		async disable(@Req() request: UserRequest, @Body() body: TwoFaAuthDto) {
			const userId = request.user;
			return this._2faService.SetTwoFactorAuthOff(`${userId}`, body.code);
		}

		@Post('login')
		async login(
			@Query('user', ParseUUIDPipe) userId: string,
			@Body() body: TwoFaAuthDto,
			@Res() response: Response,)
			{
				const isValid = await this._2faService.checkQrCode(`${userId}`,
																body.code);
				if (isValid == false) {
				throw new BadRequestException(MessagesHelper.INVALID_QR_CODE);
				}
				const payload = { id: userId };
				response.cookie('accessToken',
								this._jwtService.sign(payload),
								{sameSite: 'lax', });
				return response.status(200).json({ cookie: response.getHeader('set-cookie'),});
			}
		}
