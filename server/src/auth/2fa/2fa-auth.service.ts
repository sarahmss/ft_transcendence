import { UsersService } from "src/users/users.service";
import { authenticator } from "otplib";
import { BadRequestException, Injectable } from "@nestjs/common";
import { MessagesHelper } from "src/helpers/messages.helpers";
import * as xssFilters from 'xss-filters';

@Injectable()
	export class TwoFaAuthService {
		constructor (
			private usersService: UsersService
		){}

	/********************************* TOOLS ******************************/
	private makeDir(path: string)
	{
		const fs = require('fs');
		fs.mkdirSync(path, {recursive: true});
	}

	async createQrCode(userId: string) {
		const qrCode = require('qrcode');
		const secret = authenticator.generateSecret();
		const user = await this.usersService.findById(userId);
		const path =  `./uploads/${userId}`;
		const otpauth = authenticator.keyuri(user.userName,
											'Transcendence',
											secret);

		this.makeDir(path);
		if (user.has2FaAuth == false){
			await qrCode.toFile(`${path}/qrcode.png`, otpauth);
			this.usersService.set2FaSecret(userId, secret);
		}
	}

	/********************************* VALIDATE ******************************/
	async checkQrCode(userId: string, code: string){
		const _secret = await this.usersService.get2FaSecret(userId);
		const _code = xssFilters.inHTMLData(code);

		return authenticator.verify({token: _code, secret: _secret});
	}

	/********************************* SET ******************************/
	async SetTwoFactorAuthOn(userId: string, code: string){
		const IsCodeValid = await this.checkQrCode(userId, code);
		if (IsCodeValid == false) {
			throw new BadRequestException(MessagesHelper.INVALID_QR_CODE);
		}
		this.usersService.SetTwoFactorAuthOn(userId);
	}

	async SetTwoFactorAuthOff(userId: string, code: string){
		const IsCodeValid = await this.checkQrCode(userId, code);
		if (IsCodeValid == false) {
			throw new BadRequestException(MessagesHelper.INVALID_QR_CODE);
		}
		this.usersService.SetTwoFactorAuthOff(userId);
	}
	}
