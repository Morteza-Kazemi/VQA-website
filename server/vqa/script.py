from utils.models import VqaModel # NOTE: this dude is neccessary!
from utils import text_helper
from utils.resize_images import resize_image

import sys
import argparse
import numpy as np
import torch
from PIL import Image
import torchvision.transforms as transforms

def get_transformed_image(image_file):

    # images: resize the image and convert the image
    with open(image_file, 'r+b') as f:
      with Image.open(f) as img:
          img = resize_image(img, [args.image_size, args.image_size]).convert('RGB')

    transform = transforms.Compose(
        [transforms.ToTensor(), transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))])
    return transform(img)


def get_converted_question(question_file, qst_vocab):
    question_str = ""
    with open(question_file) as f:
        question_str = f.read()
    
    # questions: convert the question
    # vqa = np.load('/datasets/train.npy', allow_pickle=True)  # todo change this is wrong!
    qst2idc = np.array([qst_vocab.word2idx('<pad>')] * args.max_qst_length)  # padded with '<pad>' in 'ans_vocab'
    question_tokens_list = text_helper.tokenize(question_str)
    qst2idc[:len(question_tokens_list)] = [qst_vocab.word2idx(w) for w in question_tokens_list]
    return qst2idc


def main(args):
    
    ans_vocab = text_helper.VocabDict(args.input_dir + '/vocab_answers.txt')
    qst_vocab = text_helper.VocabDict(args.input_dir + '/vocab_questions.txt')

    image = get_transformed_image(image_file=args.image_file_location)
    question = get_converted_question(question_file=args.question_file_location, qst_vocab=qst_vocab)

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model_checkpoint = torch.load(args.model_location, map_location=device)
    model = VqaModel(
        embed_size=args.embed_size,
        qst_vocab_size=qst_vocab.vocab_size,
        ans_vocab_size=ans_vocab.vocab_size,
        word_embed_size=args.word_embed_size,
        num_layers=args.num_layers,
        hidden_size=args.hidden_size).to(device)
    model.load_state_dict(model_checkpoint)

    model.eval()

    # model output: give the inputs to the model
    # todo: this replication is unnecessary and has too much overhead!
    data_replication_size = 1 # this used to batch_size!
    image = np.array( [image.numpy() for i in range(data_replication_size)] )
    image = torch.tensor( image )
    # input("press enter to continue...")
    question = torch.tensor( np.array( [np.array(question) for i in range(data_replication_size)] ) )
    image_tnsr = image.to(device)
    question_tnsr = question.to(device)
    # input("press enter to continue...")
    output_tnsr = model(image_tnsr, question_tnsr)  # [batch_size, ans_vocab_size=1000]
    # convert the model output to raw answer
    for indx in range(1):  # one question only!
        maxx = torch.max(output_tnsr, 1)
        outp = maxx[1][indx]
        answer = str(ans_vocab.idx2word(outp))
        print(answer, end='')



if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument( '--input_dir', type=str, default='vqa/utils', help='')
    parser.add_argument( '--image_file_location', type=str, default='vqa/input/image.png', help='')
    parser.add_argument( '--question_file_location', type=str, default='vqa/input/question.txt', help='')
    parser.add_argument( '--model_location', type=str, default='vqa/utils/model-epoch-01.ckpt', help='')

    parser.add_argument('--max_qst_length', type=int, default=30, help='maximum length of question. \
#                               the length in the VQA dataset = 26.')
    parser.add_argument('--batch_size', type=int, default=128, help='batch_size.')
    parser.add_argument('--image_size', type=int, default=224, help='size of images after resizing')
    
    parser.add_argument('--embed_size', type=int, default=1024, help='embedding size of feature vector \
                              for both image and question.')
    parser.add_argument('--word_embed_size', type=int, default=300, help='embedding size of word \
                                  used for the input in the LSTM.')
    parser.add_argument('--num_layers', type=int, default=2, help='number of layers of the RNN(LSTM).')
    parser.add_argument('--hidden_size', type=int, default=512, help='hidden_size in the LSTM.')

    args = parser.parse_args()
    
    
    main(args)
    sys.stdout.flush()
