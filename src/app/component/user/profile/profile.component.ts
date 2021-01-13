import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { HttpService } from 'src/app/service/http.service';

interface userProfile {
  email: string;
  username: string;
  name: string;
  contactnum: number;
  profilepic: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userProfile: userProfile | {} = {};
  userProfileForm: FormGroup;
  imageURL: string;
  editProfileState: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userProfileForm = this.fb.group({
      name: ['', Validators.required],
      contactnum: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /[6|8|9]\d{7}$|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}$/
          ),
        ],
      ],
      profilepic: ['', Validators.required],
    });

    this.initializeProfile();
  }

  async updateProfile() {
    // Setting up formData for file upload
    const formData = new FormData();
    formData.set('profilepic', this.f.profilepic.value);
    formData.append('name', this.f.name.value);
    formData.append('contactnum', this.f.contactnum.value);
    const token = this.authService.getTokenFromLS()['token'];
    try {
      let result = await this.http.updateUserProfile(formData, token);
      if (result['status'] == 200) {
        // update userprofile if success
        const { name, profilepic, contactnum } = result.body as userProfile;
        this.userProfile['name'] = name;
        this.userProfile['contactnum'] = contactnum;
        this.userProfile['profilepic'] = profilepic;
      }
      this.toggleEditProfileState();
    } catch (error) {
      console.log(error);
    }
  }

  async initializeProfile() {
    try {
      const token = this.authService.getTokenFromLS()['token'];
      let result = await this.http.getUserProfile(token);
      switch (result['status']) {
        case 200:
          this.userProfile = result['body'];
          const { name, profilepic, contactnum } = result.body as userProfile;
          this.userProfileForm.patchValue({
            name,
            contactnum,
          });

          // Future implementation for appending profilepic as JS File into the form

          break;
        case 400:
          alert(result['body']);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // handle the change of image during preview and append file into form
  showPreview(event) {
    console.log('ran');
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.userProfileForm.patchValue({
      profilepic: file,
    });

    this.userProfileForm.get('profilepic').updateValueAndValidity();

    this.setPreviewImage(file);
  }

  setPreviewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  toggleEditProfileState() {
    this.editProfileState = !this.editProfileState;
  }
  // For easy reference of form control
  get f() {
    return this.userProfileForm.controls;
  }
}
