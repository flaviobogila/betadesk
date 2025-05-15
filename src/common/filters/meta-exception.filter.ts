// src/whatsapp/filters/meta-exception.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class MetaExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const metaError = exception?.response?.data?.error;

        if (metaError?.code) {
            const statusMap = this.mapMetaCodeToStatus(metaError.code);
            if (statusMap) {
                return response.status(statusMap.status).json({
                    statusCode: exception?.response?.status || 400,
                    message: statusMap.message,
                    error: "MetaErrorException",
                    meta: { code: metaError.code, error: statusMap.code, message: metaError.message, ...metaError.error_data }
                });
            }
        }

        // fallback
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            statusCode: status,
            message: exception.message || 'Erro interno do servidor',
            error: exception.name || 'Internal Server Error',
        });
    }

    private mapMetaCodeToStatus(code: number) {
        const errorMap: Record<number, { code: string; message: string; status: number }> = {
            0: { code: 'AUTH_EXCEPTION', message: 'Não foi possível autenticar o usuário do app.', status: HttpStatus.UNAUTHORIZED },
            1: { code: 'UNKNOWN_API', message: 'Solicitação inválida ou possível erro do servidor.', status: HttpStatus.BAD_REQUEST },
            2: { code: 'API_SERVICE_ERROR', message: 'Erro temporário por inatividade ou sobrecarga.', status: HttpStatus.SERVICE_UNAVAILABLE },
            3: { code: 'API_METHOD_ERROR', message: 'Método da API incorreto ou falta de permissões.', status: HttpStatus.INTERNAL_SERVER_ERROR },
            4: { code: 'RATE_LIMIT_HIT', message: 'Muitas chamadas de API. Limite excedido.', status: HttpStatus.TOO_MANY_REQUESTS },
            10: { code: 'PERMISSION_DENIED', message: 'Permissão não concedida ou removida.', status: HttpStatus.FORBIDDEN },
            33: { code: 'INVALID_PARAM_VALUE', message: 'O valor de um parâmetro é inválido.', status: HttpStatus.BAD_REQUEST },
            100: { code: 'INVALID_PARAMS', message: 'Erro de parâmetro inválido na requisição.', status: HttpStatus.BAD_REQUEST },
            190: { code: 'INVALID_TOKEN', message: 'Token de acesso inválido ou expirado.', status: HttpStatus.UNAUTHORIZED },
            368: { code: 'BLOCKED_POLICY_VIOLATION', message: 'Conta bloqueada por violação de políticas.', status: HttpStatus.FORBIDDEN },
            130429: { code: 'THROTTLE_LIMIT', message: 'Limite de volume atingido. Tente novamente mais tarde.', status: HttpStatus.TOO_MANY_REQUESTS },
            130472: { code: 'EXPERIMENTAL_NUMBER', message: 'O número faz parte de um experimento. A mensagem não foi enviada.', status: HttpStatus.BAD_REQUEST },
            130497: { code: 'BLOCKED_COUNTRY', message: 'Não é possível enviar mensagens para este país.', status: HttpStatus.FORBIDDEN },
            131000: { code: 'UNKNOWN_INTERNAL_ERROR', message: 'Erro desconhecido na API Meta.', status: HttpStatus.INTERNAL_SERVER_ERROR },
            131005: { code: 'PERMISSION_REVOKED', message: 'Permissão não concedida ou foi removida.', status: HttpStatus.FORBIDDEN },
            131008: { code: 'MISSING_REQUIRED_PARAM', message: 'Faltando parâmetro obrigatório na requisição.', status: HttpStatus.BAD_REQUEST },
            131009: { code: 'INVALID_PARAM', message: 'Valor de parâmetro inválido.', status: HttpStatus.BAD_REQUEST },
            131016: { code: 'SERVICE_TEMP_UNAVAILABLE', message: 'Serviço temporariamente indisponível.', status: HttpStatus.SERVICE_UNAVAILABLE },
            131021: { code: 'CANNOT_MESSAGE_SELF', message: 'Não é possível enviar mensagem para o próprio número.', status: HttpStatus.BAD_REQUEST },
            131026: { code: 'UNDELIVERABLE', message: 'A mensagem não pôde ser entregue.', status: HttpStatus.BAD_REQUEST },
            131037: { code: 'DISPLAY_NAME_UNAPPROVED', message: 'O nome de exibição do número precisa ser aprovado.', status: HttpStatus.BAD_REQUEST },
            131042: { code: 'PAYMENT_ISSUE', message: 'Problema relacionado ao pagamento da conta.', status: HttpStatus.BAD_REQUEST },
            131045: { code: 'CERTIFICATE_ERROR', message: 'Erro no certificado de registro.', status: HttpStatus.INTERNAL_SERVER_ERROR },
            131047: { code: 'MESSAGE_OUTSIDE_SESSION', message: 'Mais de 24h desde a última mensagem do usuário.', status: HttpStatus.BAD_REQUEST },
            131048: { code: 'SPAM_RATE_LIMIT', message: 'Limite de spam atingido.', status: HttpStatus.BAD_REQUEST },
            131049: { code: 'MESSAGE_NOT_DELIVERED_META', message: 'A Meta escolheu não entregar a mensagem.', status: HttpStatus.BAD_REQUEST },
            131050: { code: 'MARKETING_OPT_OUT', message: 'Usuário não recebe mais mensagens de marketing.', status: HttpStatus.BAD_REQUEST },
            131051: { code: 'UNSUPPORTED_MESSAGE_TYPE', message: 'Tipo de mensagem não suportado.', status: HttpStatus.BAD_REQUEST },
            131052: { code: 'MEDIA_DOWNLOAD_ERROR', message: 'Erro ao baixar a mídia da mensagem.', status: HttpStatus.BAD_REQUEST },
            131053: { code: 'MEDIA_UPLOAD_ERROR', message: 'Erro ao carregar a mídia da mensagem.', status: HttpStatus.BAD_REQUEST },
            131056: { code: 'PAIRING_RATE_LIMIT', message: 'Muitas mensagens enviadas entre os mesmos números.', status: HttpStatus.BAD_REQUEST },
            131057: { code: 'ACCOUNT_MAINTENANCE', message: 'Conta em modo de manutenção.', status: HttpStatus.SERVICE_UNAVAILABLE },
            132000: { code: 'TEMPLATE_PARAM_MISMATCH', message: 'Incompatibilidade de parâmetros no template.', status: HttpStatus.BAD_REQUEST },
            132001: { code: 'TEMPLATE_NOT_FOUND', message: `Template não encontrado`, status: HttpStatus.NOT_FOUND },
            132005: { code: 'TEMPLATE_TEXT_TOO_LONG', message: 'Texto do template é longo demais.', status: HttpStatus.BAD_REQUEST },
            132007: { code: 'TEMPLATE_FORMAT_VIOLATION', message: 'Violação de formatação no template.', status: HttpStatus.BAD_REQUEST },
            132012: { code: 'TEMPLATE_PARAM_FORMAT', message: 'Formato de parâmetro do template inválido.', status: HttpStatus.BAD_REQUEST },
            132015: { code: 'TEMPLATE_PAUSED', message: 'O template foi pausado por baixa qualidade.', status: HttpStatus.BAD_REQUEST },
            132016: { code: 'TEMPLATE_DISABLED', message: 'Template desativado permanentemente.', status: HttpStatus.BAD_REQUEST },
            132068: { code: 'FLOW_BLOCKED', message: 'O fluxo está bloqueado.', status: HttpStatus.BAD_REQUEST },
            132069: { code: 'FLOW_LIMITED', message: 'Limite de envio de fluxo atingido.', status: HttpStatus.BAD_REQUEST },
            133004: { code: 'SERVER_TEMP_UNAVAILABLE', message: 'Servidor temporariamente indisponível.', status: HttpStatus.SERVICE_UNAVAILABLE },
            135000: { code: 'GENERIC_USER_ERROR', message: 'Erro genérico no envio da mensagem.', status: HttpStatus.BAD_REQUEST }
        };

        return errorMap[code] ?? null;
    }
}
