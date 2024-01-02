import React from 'react'
import { useParams } from 'react-router'
import './PostsPost.scss'

function PostsPost() {
    const { postId } = useParams();

    const photos = ["https://scontent.ftbs6-2.fna.fbcdn.net/v/t39.30808-6/409920857_1985917071782940_2775733171832963419_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a73e89&_nc_ohc=vJBKBOr1aFsAX-gJPsM&_nc_ht=scontent.ftbs6-2.fna&oh=00_AfAQpb0uHzxt4C_jP-oRQRL-yqZoRqhtMr6OXCUG6gllJg&oe=65991BAA", "https://scontent.ftbs6-2.fna.fbcdn.net/v/t39.30808-6/411175885_1985916878449626_3637433386253463412_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a73e89&_nc_ohc=xviewXAxjg4AX9_xXPV&_nc_ht=scontent.ftbs6-2.fna&oh=00_AfDN1OP7hmxONh3cEEUzJVX4oQ21AepiDyKv9qrFzdewmQ&oe=6598C328", "https://scontent.ftbs6-2.fna.fbcdn.net/v/t39.30808-6/409929205_1985917638449550_1623098505717299191_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=a73e89&_nc_ohc=Iy6JhipCJisAX86-pxx&_nc_ht=scontent.ftbs6-2.fna&oh=00_AfDXgks4miGLl588d1LiiRNjLuLtftQbKBF3F5zlrreINA&oe=65992DE9", "https://scontent.ftbs6-2.fna.fbcdn.net/v/t39.30808-6/409979823_1985920435115937_635559480987238770_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a73e89&_nc_ohc=izOV412DnCQAX94WZE3&_nc_ht=scontent.ftbs6-2.fna&oh=00_AfBwYqV-IhLNQFsM1_zdC6_ULcmEW3a7Nc0Zq6utrzqsAA&oe=65989C31"];
    const comments = [
        {
            username: "მაია მორჩაძე",
            photoSrc: "https://scontent.ftbs6-2.fna.fbcdn.net/v/t1.18169-9/27751813_2460984614127662_895729125387504333_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=be3454&_nc_ohc=KpS9vjldBVMAX_L1KlR&_nc_ht=scontent.ftbs6-2.fna&oh=00_AfCYRixtl7TNbpj3f_zztdC8WbOhmZWea2tJGBIPMBeaAQ&oe=65BB7256",
            comment: "ჩემი ყოჩაღი და ჭკვიანი გოგო! წარმატებებით გევლოს მომავლის გზებზე. ❤❤ aaaaaaaaaaaa aaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaa"
        },
        {
            username: "მარინა რუსაძე",
            photoSrc: "https://scontent.ftbs6-2.fna.fbcdn.net/v/t39.30808-6/363939715_6165744476870734_3664077486566132140_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=AJdDi1fUjlMAX9r-I5M&_nc_ht=scontent.ftbs6-2.fna&oh=00_AfBXhsn38OouPNqGmWuRrtsLU6G0s28G1vIOpFDotOB4AA&oe=6599E049",
            comment: "გილოცავ, ნინო!❤ წარმატებები!"
        }
    ]

    return (
        <div className='postContainer'>
            <div className="postHeader">
                <div className="postHeaderImg">
                    <img src={'https://scontent.ftbs6-2.fna.fbcdn.net/v/t1.6435-9/51112780_753465495028110_1308037212029321216_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=be3454&_nc_ohc=yYCy-YrKFhwAX_h-ebX&_nc_ht=scontent.ftbs6-2.fna&oh=00_AfAEejzlRfSk8mz7Vi1RSma4BHyrt6X3zyqQ6kBVQskesQ&oe=65BB6127'} alt='photo'/>
                </div>
                <div className="postHeaderTxt">
                    <h1>10გ კლასის მოსწავლე ნინო სტურუა</h1>
                    <div className="postInfo">
                        <p id='postDate'>15.12.2023</p>
                        <p id='postAuthor'>ადმინისტრაცია</p>
                    </div>
                </div>
            </div>

            <p className='postTxt'>თსუ საბავშვო უნივერსიტეტის ორგანიზებით, მიმდინარე წლის დეკემბერში გაიმართა კონკურსი (კონფერენცია). კონკურსი ეძღვნებოდა ადამიანის უფლებათა საყოველთაო დეკლარაციის მიღების დღეს (მიღებულ იქნა გაეროს გენერალური ასამბლეის მიერ 1948 წლის 10 დეკემბერს).მონაწილე 150 მოსწავლიდან ფინალურ ეტაპზე 25 მოსწავლე გადავიდა. აღნიშნული კონკურსის ფინალისტი გახდა ჩვენი სკოლის მე-10გ კლასის მოსწავლე- ნინო სტურუა, რომელიც კონფერენციაზე წარსდგა თემით: ,,სამართლის უზენაესობა“. (კლასის ხელმძღვანელი- მაია ფანცხავა. საკონფერენციო თემის ხელმძღვანელი- ლილი შუბლაძე). ნინო დაჯილდოვდა სერტიფიკატით, მისი ნაშრომი დაიბეჭდება უნივერსიტეტის ჟურნალში და მას შესაძლებლობა ეძლევა მონაწილეობა მიიღოს საბავშვო უნივერსიტეტის მიერ ორგანიზებულ ყოველწლიურ ზამთრის სკოლაში.ვულოცავთ ნინოს ამ დიდ წარმატებას!</p>

            <div className="postPhotoHolder">
                {
                    photos.map((data, ind) => {
                        return (
                            <img className='postScrollImg' alt='photo' src={data} key={ind} />
                        )
                    })
                }
            </div>

            <div className="postAddComment">
                <input type='text' placeholder='კომენტარის დატოვება'/>
                <button>ატვირთვა</button>
            </div>

            <div className="postComments">
                {
                    comments.map((data, ind) => {
                        return (
                            <div className="postComment" key={ind}>
                                <img alt='photo' src={data.photoSrc} />
                                <div className="postCommentData">
                                    <p id='username'>{data.username}</p>
                                    <p>{data.comment}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default PostsPost