
// Define interfaces
export interface PersonObjectInterface {
    id: number;
    naam: string;
    huisnummer: string;
    postcode: string;
    telefoonnummer: string;
    vastBedrag: number;
    rondeBedrag: number;
    vastBedragQR: number;
    rondeBedragQR: number;
    rondes: number;
    create_time: string;
    code: string;
    betaald: number;
}

export interface pageObject {
    [index: number]: {
        name: string;
        icon: React.ReactNode;
        content: React.ReactNode;
        appBar?: React.ReactNode;
        fab?: {
            name: string;
            icon: React.ReactNode;
            action: any;
        }
    }
    map: any;
}


export interface CountingListInterface {
    search: string;
}

export interface CountingListStateInterface {
    codeError: any;
    persons?: {
        [index: number]: PersonObjectInterface;
        map: any;
        filter: any;
        length: number;
        indexOf: any;
        forEach: any;
        some: any;
        findIndex: any;
        find: any;
    }
    rendered?: React.ReactNode;
    dialogOpen: boolean;
    currentPerson: PersonObjectInterface;
    listClickDisabled: boolean;
    changeRoundOpen: boolean;
    codes: {
        [index: number]: number;
    }
    currentNameSetRound: string;
    setRoundButtonDisabled: boolean;
    personEdit: string;
    paymentDialogOpen: any;
}


export interface PaymentListInterface {
    search: string;
}


export interface PaymentListStateInterface {
    codeError: any;
    persons?: {
        [index: number]: PersonObjectInterface;
        map: any;
        filter: any;
        length: number;
        indexOf: any;
        forEach: any;
        some: any;
        findIndex: any;
        find: any;
    }
    rendered?: React.ReactNode;

    dialogOpen: boolean;
    currentPerson: PersonObjectInterface;
    listClickDisabled: boolean;
    paymentDialogOpen: boolean;
    codes: {
        [index: number]: number;
    }
    currentNameSetRound: string;
    setRoundButtonDisabled: boolean;
    personEdit: string;
}


export interface PersonListInterface {
    search: string;
}


export interface PersonListStateInterface {
    rendered: any;
    paymentDialogOpen: boolean;
    persons?: React.ReactNode,
    dialogOpen: boolean;
    currentPerson: PersonObjectInterface;
    listClickDisabled: boolean;
    addDialogOpen: boolean;
    editDialogOpen: any;
    data?: any;
    personEdit: string;

}