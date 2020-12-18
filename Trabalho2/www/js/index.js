var BASE64_MARKER = ';base64,';

var ehcordova = false;

var CPF;
var endServidor = 'http://localhost:8080';
var CameraImageDOM = Element('imageFile');

function postAjax(url, data) 
{
    var xhr = new window.XMLHttpRequest();

    xhr.open("POST", url, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() { 
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            if(xhr.responseText != null){
                var msg = JSON.parse(xhr.responseText)

                switch(msg.tipo){

                    case 'Erro':

                        alert(msg.msg)

                        break;

                    case 'Sucesso':

                        alert(msg.msg)

                        break;

                    case 'SucessoRegistro':

                        alert(msg.msg)

                        Element('RegistroPass').value = ''
                        Element('RegistroPassConfirm').value = ''
                        Element('RegistroCPF').value = ''
                        Element('RegistroNome').value = ''
                        Element('RegistroEMail').value = ''
                        
                        Element('Registro').style.display = 'none'
                        Element('Login').style.display = 'block'

                        break;
                        
                    case 'SucessoLogin':

                        alert(msg.msg)

                        Element('Login').style.display = 'none'
                        Element('UsuarioInterface').style.display = 'block'

                        break;

                    case 'RespostaCodigo':

                        let alertmsg =  'Nome: '+msg.InfoItem.Nome+
                                        '\nPreço Antigo: R$'+msg.InfoItem.Preço+
                                        '\nDesconto: '+msg.Desconto+'%'+
                                        '\nPreço Descontado: R$'+msg.NovoPreço;

                        alert(alertmsg)

                        break;

                }

            }
        }
    }
    xhr.send(JSON.stringify(data));
}


function Element(ID) {
    return document.getElementById(ID);
}

var app = {

    initialize: function() {
        if (ehcordova == true) document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        else this.onDeviceReady();


    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {

        var ui = phonon.navigator();
        ui.start();

        Element('BotaoLoga').addEventListener('click', function(){
            let usuario = Element('LoginUser').value
            CPF = usuario
            let password = Element('LoginPass').value
            postAjax(endServidor+"/entrar",{user: usuario, pass: password});

        }, false)

        Element('BotaoRegistra').addEventListener('click', function(){

            Element('Registro').style.display = 'block'
            Element('Login').style.display = 'none'

        }, false)

        Element('ConfirmaRegistro').addEventListener('click', function(){

            let password = Element('RegistroPass').value
            let passwordConf = Element('RegistroPassConfirm').value
            let CPF = Element('RegistroCPF').value
            let Nome = Element('RegistroNome').value
            let EMail = Element('RegistroEMail').value

            if(password == passwordConf){

                postAjax(endServidor+'/confirmaRegistro',{CPF: CPF, Nome: Nome, Senha: password, EMail: EMail})

            }
            else{

                alert('As senhas não batem')

            }

        },false)
        
        Element('CancelarRegistro').addEventListener('click', function(){

            Element('RegistroPass').value = ''
            Element('RegistroPassConfirm').value = ''
            Element('RegistroCPF').value = ''
            Element('RegistroNome').value = ''
            Element('RegistroEMail').value = ''

            Element('Registro').style.display = 'none'
            Element('Login').style.display = 'block'            

        },false)

        Element('UsuarioDesconectar').addEventListener('click',function(){
            
            Element('RegistroPass').value = ''
            Element('RegistroPassConfirm').value = ''
            Element('RegistroCPF').value = ''
            Element('RegistroNome').value = ''
            Element('RegistroEMail').value = ''
            CPF = ''

            Element('Login').style.display = 'block'
            Element('UsuarioInterface').style.display = 'none'


        },false)

        Element('UsuarioQRAnalise').addEventListener('click',function(){
            
            alert('Em construção!')

            // let FrameQR = new Image()
            // let FramePath = Element('QRImage').value.replace('C:\\fakepath\\','')
                
            // CameraImageDOM.src = './img/'+FramePath 
            // FrameQR.src = './img/'+FramePath 

            // var imageWidth = FrameQR.width
            // var imageHeight = FrameQR.height

            // let BinaryArray = convertDataURIToBinaryFF(base64Index)

            // let codigoQR = QRAnalise(Element('canvas'),300,300)

            // alert(codigoQR)
            // QRAnalise(convertDataURIToBinaryFF(QRImage))
            
            // postAjax(endServidor+"/enviaQRCODE",{barcode: codigoQR, CPF: CPF});

        },false)

        Element('UsuarioTestaQR').addEventListener('click',function(){
            
            let codeQR = Element('QRImage').value
            codeQR = codeQR.replace('C:\\fakepath\\','')
            CameraImageDOM.src = './img/'+codeQR
            codeQR = codeQR.replace('.png','')

            postAjax(endServidor+"/enviaQRCODE",{IdItem: codeQR, CPF: CPF})            

        }, false)

    }
};


window.onload = function() {
    if (typeof(cordova) == "object") ehcordova = true;

    app.initialize();

};

function convertDataURIToBinaryFF(dataURI) { 
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length; 
    var raw = window.atob(dataURI.substring(base64Index));
    return Uint8Array.from(Array.prototype.map.call(raw,function(x) { 
            return x.charCodeAt(0); 
        })); 
};

function QRAnalise(dataURI,dataWidth,dataHeight){
    
    console.log(dataURI)
    console.log(dataWidth)
    console.log(dataHeight)

    const code = jsQR(dataURI, dataWidth, dataHeight);
    
    alert(code)

}