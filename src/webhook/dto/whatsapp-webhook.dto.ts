export class WhatsAppWebhookDto {
    object: string;
    entry: WhatsAppEntry[];
}

export class WhatsAppEntry {
    id: string;
    changes: WhatsAppChange[];
}

export class WhatsAppChange {
    field: string;
    value: WhatsAppChangeValue | WhatsAppEventTemplate;
}

export class WhatsAppChangeValue {
    messaging_product: string;
    metadata: {
        display_phone_number: string;
        phone_number_id: string;
    };
    contacts?: WhatsAppContact[];
    messages?: WhatsAppMessage[];
    statuses?: WhatsAppMessageStatus[];
}

export class WhatsAppEventTemplate {
    event: string
    message_template_id: string
    message_template_name: string
    message_template_language: string
    reason: string
}

export class WhatsAppContact {
    profile: { name: string };
    wa_id: string;
}

export interface WhatsAppMessage {
    from: string;
    id: string;
    timestamp: string;
    type:
    | 'text'
    | 'image'
    | 'audio'
    | 'video'
    | 'document'
    | 'sticker'
    | 'location'
    | 'contacts'
    | 'button'
    | 'interactive'
    | 'reaction';

    text?: {
        body: string;
    };

    image?: {
        id: string;
        mime_type: string;
        sha256?: string;
        caption?: string;
    };

    audio?: {
        id: string;
        mime_type?: string;
    };

    video?: {
        id: string;
        mime_type?: string;
        caption?: string;
    };

    document?: {
        id: string;
        filename?: string;
        mime_type?: string;
    };

    sticker?: {
        id: string;
        mime_type?: string;
    };

    location?: {
        latitude: number;
        longitude: number;
        name?: string;
        address?: string;
    };

    contacts?: {
        addresses?: {
            city?: string;
            country?: string;
            zip?: string;
            state?: string;
            street?: string;
            type?: string;
        }
        birthday?: string;
        emails?: {
            email: string;
            type: string;
        }[];
        name?: {
            first_name?: string;
            formatted_name?: string;
            last_name?: string;
        };
        org?: {
            company?: string;
            department?: string;
            title?: string;
        };
        phones?: {
            phone: string;
            wa_id?: string,
            type?: 'HOME' | 'WORK' | 'OTHER' | string;
        }[];
        urls?: {
            url: string;
            type?: 'HOME' | 'WORK' | 'OTHER' | string;
        }[]
    }[];

    button?: {
        payload: string;
        text: string;
    };

    interactive?: {
        type: 'button_reply' | 'list_reply';
        button_reply?: {
            id: string;
            title: string;
        };
        list_reply?: {
            id: string;
            title: string;
            description?: string;
        };
    };

    reaction?: {
        emoji: string;
        message_id: string;
    };

    context?: {
        from: string;
        id: string;
    };

    errors?: {
        code: number;
        title: string;
        message?: string;
        error_data?: {
            details?: string;
        }
    }[];

}

export type WhatsAppMessageStatus = {
    id: string; // ID da mensagem original (wamid)
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    recipient_id: string;
    conversation?: {
        id: string;
        origin: {
            type: 'user_initiated' | 'business_initiated' | 'referral';
        };
    };
    pricing?: {
        billable: boolean;
        pricing_model: 'CBP' | 'FIXED';
        category: 'marketing' | 'utility' | 'authentication' | string;
    };
    errors?: {
        code: number;
        title: string;
        details?: string;
    }[];
};


export class WhatsAppMediaDownloadResponse {
    id: string;
    mime_type: string;
    sha256: string;
    url: string;
    file_size: number;
    filename: string;
    caption?: string;
}

